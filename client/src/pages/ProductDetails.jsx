import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Optional, fallback to alert if not installed

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);

    // Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/products/${id}/reviews`);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = async () => {
        if (!userId) return alert("Please Login First!");
        
        if (product.sizes && !selectedSize) {
            alert("Please select a size!");
            return;
        }

        try {
            await axios.post('http://localhost:5001/cart', { 
                userId, 
                productId: id, 
                quantity: 1,
                size: selectedSize 
            });
            alert("Added to Cart!");
        } catch (err) {
            alert("Error adding to cart");
        }
    };

    // --- WISHLIST FUNCTION ---
    const addToWishlist = async () => {
        if (!userId) return alert("Please Login First!");
        try {
            await axios.post('http://localhost:5001/wishlist', { userId, productId: id });
            alert("Added to Wishlist ❤️");
        } catch (err) {
            alert("Already in wishlist or error");
        }
    };

    if (!product) return <h2>Loading...</h2>;

    const sizeArray = product.sizes ? product.sizes.split(',') : [];

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: 'auto' }}>
            
            <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
                {/* Image */}
                <img 
                    src={product.image_url} 
                    alt={product.name} 
                    style={{ flex: 1, minWidth: '300px', height: '450px', objectFit: 'cover', borderRadius: '10px' }} 
                />
                
                {/* Details */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>{product.name}</h1>
                    <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '5px', color: '#555' }}>{product.category}</span>
                    
                    <h2 style={{ fontSize: '30px', margin: '20px 0' }}>${product.price}</h2>
                    <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>{product.description}</p>
                    
                    {/* Size Selector */}
                    {sizeArray.length > 0 && (
                        <div style={{ margin: '30px 0' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Size:</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {sizeArray.map((size) => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            width: '40px', height: '40px',
                                            borderRadius: '50%',
                                            border: selectedSize === size ? '2px solid black' : '1px solid #ccc',
                                            background: selectedSize === size ? 'black' : 'white',
                                            color: selectedSize === size ? 'white' : 'black',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- BUTTONS SECTION --- */}
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <button 
                            onClick={addToCart}
                            style={{ flex: 1, padding: '15px', fontSize: '18px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '30px' }}
                        >
                            ADD TO CART
                        </button>

                        {/* WISHLIST BUTTON */}
                        <button 
                            onClick={addToWishlist}
                            style={{ 
                                width: '60px', 
                                fontSize: '24px', 
                                background: 'white', 
                                border: '2px solid #eee', 
                                cursor: 'pointer', 
                                borderRadius: '30px',
                                color: 'red',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Add to Wishlist"
                        >
                            ❤️
                        </button>
                    </div>

                </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <h2>Reviews</h2>
                {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(r => (
                    <div key={r.id} style={{ borderBottom: '1px solid #f0f0f0', padding: '10px 0' }}>
                        <strong>{r.first_name}:</strong> {r.comment} ({r.rating}★)
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductDetails;