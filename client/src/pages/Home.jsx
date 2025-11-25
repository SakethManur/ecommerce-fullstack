import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SkeletonCard from '../components/Skeleton'; // Make sure this file exists

function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [loading, setLoading] = useState(true); // Loading State

    useEffect(() => {
        fetchProducts();
    }, [search, minPrice, maxPrice, sort]);

    const fetchProducts = async () => {
        setLoading(true); // Start Loading
        try {
            const response = await axios.get('http://localhost:5001/products', {
                params: { search, minPrice, maxPrice, sort }
            });
            setProducts(response.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false); // Stop Loading
        }
    };

    const addToCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return alert("Please Login First!");

        try {
            await axios.post('http://localhost:5001/cart', { userId, productId, quantity: 1 });
            alert("Added to Cart!");
        } catch (err) {
            alert("Error adding to cart");
        }
    };

    const updatePhone = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return alert("Please Login First!");
        try {
            await axios.put('http://localhost:5001/account/update', { userId, phone: newPhone });
            alert("Phone number updated!");
            setNewPhone(''); 
        } catch (err) { alert("Failed to update"); }
    };

    const categories = ["All", "Electronics", "Fashion", "Home", "Lifestyle"];
    const handleCategoryClick = (cat) => setSearch(cat === "All" ? "" : cat);

    return (
        <div>
            {/* HERO SECTION */}
            <div style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop')",
                height: '400px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative',
                borderRadius: '10px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '10px' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '50px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Summer Collection</h1>
                    <p style={{ fontSize: '20px', margin: '0 0 20px 0', fontWeight: '300' }}>Discover the latest trends.</p>
                    <button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} style={{ padding: '15px 35px', fontSize: '18px', background: 'white', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '30px' }}>Shop Now</button>
                </div>
            </div>

            {/* CATEGORIES */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '5px' }}>
                {categories.map((cat) => (
                    <button key={cat} onClick={() => handleCategoryClick(cat)} style={{ padding: '12px 25px', borderRadius: '30px', border: '1px solid #ddd', background: search === cat ? 'black' : 'white', color: search === cat ? 'white' : 'black', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{cat}</button>
                ))}
            </div>

            {/* FILTERS */}
            <div style={{ padding: '15px', background: '#f8f9fa', marginBottom: '30px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <input type="number" min="0" placeholder="Min Price" value={minPrice} onChange={(e) => { if (e.target.value === '' || Number(e.target.value) >= 0) setMinPrice(e.target.value); }} style={{ padding: '8px', width: '80px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <input type="number" min="0" placeholder="Max Price" value={maxPrice} onChange={(e) => { if (e.target.value === '' || Number(e.target.value) >= 0) setMaxPrice(e.target.value); }} style={{ padding: '8px', width: '80px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <select onChange={(e) => setSort(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                    <option value="">Sort By</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                </select>
            </div>

            {/* PRODUCT GRID (WITH SKELETONS) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                {loading ? (
                    // SHOW SKELETONS WHILE LOADING
                    [...Array(8)].map((_, index) => <SkeletonCard key={index} />)
                ) : (
                    // SHOW REAL PRODUCTS
                    products.map((product) => (
                        <div key={product.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '420px', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                <h3 style={{ fontSize: '18px', margin: '15px 0 10px 0' }}>{product.name}</h3>
                            </Link>
                            <div>
                                <span style={{ background: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', color: '#555', textTransform: 'uppercase' }}>{product.category}</span>
                                <p style={{ fontWeight: 'bold', fontSize: '22px', margin: '15px 0' }}>${product.price}</p>
                            </div>

                            {/* STOCK LOGIC */}
                            {product.stock > 0 ? (
                                <button onClick={() => addToCart(product.id)} style={{ marginTop: 'auto', background: 'black', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', width: '100%', borderRadius: '5px', fontWeight: 'bold' }}>Add to Cart</button>
                            ) : (
                                <button disabled style={{ marginTop: 'auto', background: '#ddd', color: '#888', border: 'none', padding: '12px', cursor: 'not-allowed', width: '100%', borderRadius: '5px', fontWeight: 'bold' }}>Out of Stock ❌</button>
                            )}
                            {product.stock > 0 && product.stock < 5 && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center', marginTop: '5px', fontWeight: 'bold' }}>🔥 Hurry! Only {product.stock} left!</p>}
                        </div>
                    ))
                )}
            </div>

            {/* PROFILE UPDATER */}
            <div style={{ marginTop: '50px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc' }}>
                <h4 style={{ marginTop: 0 }}>Update Profile (Testing)</h4>
                <input type="text" placeholder="Enter Phone Number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} style={{ padding: '8px', marginRight: '10px' }} />
                <button onClick={updatePhone} style={{ padding: '8px 15px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Phone</button>
            </div>
        </div>
    );
}

export default Home;