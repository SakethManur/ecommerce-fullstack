import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

// --- MOCK TOASTIFY ---
const toast = {
  success: (msg) => alert(`✅ ${msg}`),
  error: (msg) => alert(`❌ ${msg}`),
};

// --- API SETUP ---
// FIXED: Hardcoded URL to prevent "import.meta" syntax errors in preview environment.
// Ideally, you would use environment variables, but this guarantees connection to your live backend.
const API_URL = 'https://my-shop-api-r0me.onrender.com';

const api = axios.create({
    baseURL: API_URL,
});

// --- COMPONENTS ---

const SkeletonCard = () => (
  <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', height: '420px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'white' }}>
    <div style={{ width: '100%', height: '200px', background: '#e0e0e0', borderRadius: '8px' }}></div>
    <div style={{ width: '80%', height: '20px', background: '#e0e0e0', borderRadius: '4px' }}></div>
    <div style={{ width: '40%', height: '15px', background: '#e0e0e0', borderRadius: '4px' }}></div>
  </div>
);

function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchProducts(); }, [search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products', { params: { search } });
            setProducts(response.data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    const addToCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return toast.error("Please Login First!");
        try {
            await api.post('/cart', { userId, productId, quantity: 1 });
            toast.success("Added to Cart!");
        } catch (err) { toast.error("Error adding to cart"); }
    };

    return (
        <div>
            <div style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop')",
                height: '300px', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '30px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
            }}>
                <h1 style={{ fontSize: '40px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Summer Collection</h1>
            </div>

            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                {loading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : products.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                            <h3 style={{ fontSize: '18px', margin: '15px 0' }}>{product.name}</h3>
                        </Link>
                        <p style={{ fontWeight: 'bold', fontSize: '20px' }}>${product.price}</p>
                        <button onClick={() => addToCart(product.id)} style={{ background: 'black', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => { api.get(`/products/${id}`).then(res => setProduct(res.data)); }, [id]);

    const addToCart = async () => {
        if (!userId) return toast.error("Please Login First!");
        try {
            await api.post('/cart', { userId, productId: id, quantity: 1 });
            toast.success("Added to Cart!");
        } catch (err) { toast.error("Error"); }
    };

    if (!product) return <h2>Loading...</h2>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div style={{ display: 'flex', gap: '40px' }}>
                <img src={product.image_url} style={{ width: '300px', borderRadius: '10px' }} />
                <div>
                    <h1>{product.name}</h1>
                    <h2>${product.price}</h2>
                    <p>{product.description}</p>
                    <button onClick={addToCart} style={{ background: 'black', color: 'white', padding: '15px 30px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
}

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) navigate('/login');
        else api.get(`/cart?userId=${userId}`).then(res => setCartItems(res.data));
    }, []);

    const removeFromCart = async (id) => {
        await api.delete(`/cart/${id}`);
        window.location.reload();
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <h1>Your Cart</h1>
            {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <img src={item.image_url} style={{ width: '50px', height: '50px' }} />
                        <div>
                            <h4>{item.name}</h4>
                            <p>${item.price}</p>
                        </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>Remove</button>
                </div>
            ))}
            {cartItems.length > 0 && (
                <button onClick={() => navigate('/order', { state: { items: cartItems } })} style={{ marginTop: '20px', width: '100%', padding: '15px', background: 'black', color: 'white', border: 'none' }}>Checkout</button>
            )}
        </div>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/authentication/login', { email, password });
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role);
            toast.success("Welcome back!");
            navigate('/');
            window.location.reload(); 
        } catch (err) { toast.error("Login Failed"); }
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px' }} />
                <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>Login</button>
            </form>
            <p>Admin Email: manursaketh@gmail.com</p>
        </div>
    );
}

function Order() {
    const location = useLocation();
    const items = location.state?.items || [];
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleBuy = async () => {
        try {
            await api.post('/order', { userId, items, address: "123 Test St" });
            toast.success("Order Placed!");
            navigate('/ordered-items');
        } catch (err) { toast.error("Failed"); }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <h1>Checkout</h1>
            <p>Total Items: {items.length}</p>
            <button onClick={handleBuy} style={{ padding: '15px 40px', background: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>Confirm Purchase</button>
        </div>
    );
}

function OrderedItems() {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if(userId) api.get(`/ordered-items?userId=${userId}`).then(res => setOrders(res.data));
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h1>My Orders</h1>
            {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
                    <h3>Order #{order.id} - {order.status}</h3>
                    <p>Total: ${order.total_price}</p>
                </div>
            ))}
        </div>
    );
}

function Wishlist() {
    const [items, setItems] = useState([]);
    const userId = localStorage.getItem('userId');
    useEffect(() => { if (userId) api.get(`/wishlist?userId=${userId}`).then(res => setItems(res.data)); }, []);
    
    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h1>My Wishlist ❤️</h1>
            {items.map(item => (
                <div key={item.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                    {item.name} - ${item.price}
                </div>
            ))}
        </div>
    );
}

function Admin() {
    const [orders, setOrders] = useState([]);
    useEffect(() => { api.get('/admin/orders').then(res => setOrders(res.data)); }, []);
    
    const handleStatus = (id, status) => {
        api.put(`/admin/order/${id}/status`, { status }).then(() => {
            toast.success("Updated!");
            api.get('/admin/orders').then(res => setOrders(res.data));
        });
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            <h1>Admin Panel</h1>
            {orders.map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', marginBottom: '5px' }}>
                    <span>Order #{order.id} ({order.status})</span>
                    <div>
                        <button onClick={() => handleStatus(order.id, 'Shipped')}>Ship</button>
                        <button onClick={() => handleStatus(order.id, 'Delivered')}>Deliver</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (userId) setIsLoggedIn(true);
    if (role === 'admin') setIsAdmin(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/#/login'; 
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <nav style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'black' }}>🛍️ SHOP</Link>
                <Link to="/" style={{ textDecoration: 'none', color: '#555' }}>Home</Link>
                <Link to="/cart" style={{ textDecoration: 'none', color: '#555' }}>Cart</Link>
                {isLoggedIn && <Link to="/ordered-items" style={{ textDecoration: 'none', color: '#555' }}>Orders</Link>}
                {isLoggedIn && <Link to="/wishlist" style={{ textDecoration: 'none', color: '#555' }}>Wishlist</Link>}
                {isAdmin && <Link to="/admin" style={{ color: 'red', fontWeight: 'bold' }}>ADMIN</Link>}
            </div>
            <div>
                {isLoggedIn ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
            </div>
        </nav>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/order" element={<Order />} />
            <Route path="/ordered-items" element={<OrderedItems />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;