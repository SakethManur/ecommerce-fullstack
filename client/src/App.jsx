import React, { useState, useEffect } from 'react';
// 1. USE HASHROUTER (Fixes 404 errors on Vercel)
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

// --- CONFIGURATION ---
// ⚠️ PASTE YOUR RENDER URL INSIDE THE QUOTES BELOW ⚠️
const API_URL = 'https://my-shop-api-r0me.onrender.com'; 

const api = axios.create({
    baseURL: API_URL,
});

// --- TOAST NOTIFICATIONS ---
const toast = {
  success: (msg) => {
    const div = document.createElement('div');
    div.textContent = `✅ ${msg}`;
    div.style.cssText = "position:fixed; top:20px; right:20px; background:#4caf50; color:white; padding:15px; borderRadius:5px; zIndex:1000; boxShadow:0 2px 10px rgba(0,0,0,0.2); animation: fadeIn 0.5s;";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  },
  error: (msg) => {
    const div = document.createElement('div');
    div.textContent = `❌ ${msg}`;
    div.style.cssText = "position:fixed; top:20px; right:20px; background:#f44336; color:white; padding:15px; borderRadius:5px; zIndex:1000; boxShadow:0 2px 10px rgba(0,0,0,0.2); animation: fadeIn 0.5s;";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
};

// --- COMPONENTS ---

// 1. Loading Skeleton
const SkeletonCard = () => (
  <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', height: '400px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'white' }}>
    <div style={{ width: '100%', height: '200px', background: '#f0f0f0', borderRadius: '8px' }}></div>
    <div style={{ width: '80%', height: '20px', background: '#f0f0f0', borderRadius: '4px' }}></div>
    <div style={{ width: '40%', height: '20px', background: '#f0f0f0', borderRadius: '4px' }}></div>
  </div>
);

// 2. Home Page (Product Grid)
function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        api.get('/products')
           .then(res => setProducts(res.data))
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, []);

    const addToCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return toast.error("Please Login First");
        try {
            await api.post('/cart', { userId, productId, quantity: 1 });
            toast.success("Added to Cart!");
        } catch (err) { toast.error("Failed to add"); }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
            {/* HERO BANNER */}
            <div style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop')",
                height: '400px', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '40px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative'
            }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '50px', margin: 0, fontWeight: '800' }}>SUMMER SALE</h1>
                    <p style={{ fontSize: '20px', marginTop: '10px' }}>Up to 50% Off on New Arrivals</p>
                </div>
            </div>

            <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Latest Products</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                {loading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : products.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #eaeaea', borderRadius: '10px', overflow: 'hidden', transition: 'transform 0.2s', background: 'white', display: 'flex', flexDirection: 'column' }}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>{product.name}</h3>
                                <p style={{ fontSize: '14px', color: '#777' }}>{product.category}</p>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0' }}>${product.price}</p>
                            </div>
                        </Link>
                        <button onClick={() => addToCart(product.id)} style={{ width: '100%', padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: 'auto' }}>
                            ADD TO CART
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. Product Details
function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => { api.get(`/products/${id}`).then(res => setProduct(res.data)); }, [id]);

    const addToCart = async () => {
        if (!userId) return toast.error("Please Login First");
        try {
            await api.post('/cart', { userId, productId: id, quantity: 1 });
            toast.success("Added to Cart!");
        } catch (err) { toast.error("Failed"); }
    };
    
    const addToWishlist = async () => {
        if (!userId) return toast.error("Please Login First");
        try {
            await api.post('/wishlist', { userId, productId: id });
            toast.success("Added to Wishlist ❤️");
        } catch (err) { toast.error("Failed"); }
    };

    if (!product) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px', display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
            <img src={product.image_url} style={{ flex: 1, minWidth: '300px', borderRadius: '15px', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '40px', marginBottom: '10px' }}>{product.name}</h1>
                <span style={{ background: '#f0f0f0', padding: '5px 15px', borderRadius: '20px', fontSize: '14px' }}>{product.category}</span>
                <p style={{ fontSize: '30px', fontWeight: 'bold', margin: '20px 0' }}>${product.price}</p>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{product.description}</p>
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button onClick={addToCart} style={{ flex: 2, padding: '15px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>ADD TO CART</button>
                    <button onClick={addToWishlist} style={{ flex: 1, background: 'white', border: '2px solid #eee', borderRadius: '8px', cursor: 'pointer', fontSize: '24px' }}>❤️</button>
                </div>
            </div>
        </div>
    );
}

// 4. Cart
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
        // Refresh cart locally instead of full page reload
        const res = await api.get(`/cart?userId=${userId}`);
        setCartItems(res.data);
    };

    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '30px' }}>Your Shopping Cart</h1>
            {cartItems.length === 0 ? <p>Cart is empty.</p> : (
                <>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <img src={item.image_url} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                                    <p>${item.price}</p>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                        </div>
                    ))}
                    <div style={{ marginTop: '30px', textAlign: 'right' }}>
                        <h2>Total: ${total.toFixed(2)}</h2>
                        <button onClick={() => navigate('/order', { state: { items: cartItems } })} style={{ padding: '15px 40px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', marginTop: '15px' }}>
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// 5. Checkout
function Order() {
    const location = useLocation();
    const items = location.state?.items || [];
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleBuy = async () => {
        try {
            await api.post('/order', { userId, items, address: "123 Main St" });
            toast.success("Order Placed Successfully! 🎉");
            navigate('/ordered-items');
        } catch (err) { toast.error("Failed to place order"); }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
            <h1>Checkout</h1>
            <p>You are about to purchase <strong>{items.length} items</strong>.</p>
            <button onClick={handleBuy} style={{ marginTop: '20px', padding: '15px 40px', background: 'green', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}>
                Confirm Payment
            </button>
        </div>
    );
}

// 6. Login & Signup (RESTORED)
function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLoginMode ? '/authentication/login' : '/authentication/create-account';
        
        try {
            const response = await api.post(endpoint, formData);
            
            if (isLoginMode) {
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('role', response.data.role);
                toast.success("Login Successful!");
                navigate('/');
                window.location.reload();
            } else {
                toast.success("Account Created! Please Login.");
                setIsLoginMode(true);
            }
        } catch (err) { 
            toast.error(isLoginMode ? "Invalid Credentials" : "User already exists"); 
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLoginMode && (
                    <>
                        <input name="firstName" placeholder="First Name" onChange={handleChange} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }} required />
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }} required />
                    </>
                )}
                <input name="email" type="email" placeholder="Email" onChange={handleChange} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }} required />
                
                <button type="submit" style={{ padding: '12px', background: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLoginMode(!isLoginMode)}>
                {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </p>
        </div>
    );
}

// 7. Orders
function OrderedItems() {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if(userId) api.get(`/ordered-items?userId=${userId}`).then(res => setOrders(res.data));
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '30px' }}>My Order History</h1>
            {orders.length === 0 ? <p>No orders found.</p> : orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #eee', padding: '20px', marginBottom: '20px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>Order #{order.id}</span>
                        <span style={{ background: '#e3f2fd', padding: '5px 10px', borderRadius: '15px', color: '#1976d2', fontSize: '12px', fontWeight: 'bold' }}>{order.status}</span>
                    </div>
                    <p>Total: ${order.total_price}</p>
                    <p style={{ fontSize: '12px', color: '#888' }}>Placed on: {new Date(order.order_date).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

// 8. Wishlist
function Wishlist() {
    const [items, setItems] = useState([]);
    const userId = localStorage.getItem('userId');
    useEffect(() => { if (userId) api.get(`/wishlist?userId=${userId}`).then(res => setItems(res.data)); }, []);
    
    return (
        <div style={{ maxWidth: '800px', margin: '50px auto' }}>
            <h1>My Wishlist ❤️</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
                        <Link to={`/product/${item.product_id || item.id}`}>
                            <img src={item.image_url} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
                        </Link>
                        <h4 style={{ margin: '10px 0' }}>{item.name}</h4>
                        <p>${item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 9. Admin Panel
function Admin() {
    const [orders, setOrders] = useState([]);
    useEffect(() => { api.get('/admin/orders').then(res => setOrders(res.data)); }, []);
    
    const handleStatus = (id, status) => {
        api.put(`/admin/order/${id}/status`, { status }).then(() => {
            toast.success(`Marked as ${status}`);
            api.get('/admin/orders').then(res => setOrders(res.data));
        });
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>
            <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
                {orders.map(order => (
                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
                        <div>
                            <strong>Order #{order.id}</strong>
                            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>({order.status})</span>
                            <div style={{ fontSize: '14px', color: '#888' }}>{order.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleStatus(order.id, 'Shipped')} style={{ background: '#2196f3', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Ship</button>
                            <button onClick={() => handleStatus(order.id, 'Delivered')} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Deliver</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- MAIN APP (ROUTING) ---
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
      <div style={{ fontFamily: "'Inter', sans-serif", color: '#333' }}>
        
        {/* NAVBAR */}
        <nav style={{ padding: '20px 40px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '24px', fontWeight: '900', textDecoration: 'none', color: 'black', letterSpacing: '-1px' }}>MYSHOP.</Link>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>Home</Link>
                    <Link to="/cart" style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>Cart</Link>
                    {isLoggedIn && <Link to="/ordered-items" style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>Orders</Link>}
                    {isLoggedIn && <Link to="/wishlist" style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>Wishlist</Link>}
                </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {isAdmin && <Link to="/admin" style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '14px', border: '1px solid #d32f2f', padding: '5px 10px', borderRadius: '5px', textDecoration: 'none' }}>ADMIN PANEL</Link>}
                {isLoggedIn ? (
                    <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
                ) : (
                    <Link to="/login" style={{ background: 'black', color: 'white', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                )}
            </div>
        </nav>

        {/* ROUTES */}
        <div style={{ minHeight: '80vh' }}>
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

        {/* FOOTER */}
        <footer style={{ background: '#f9f9f9', padding: '40px', textAlign: 'center', marginTop: '50px', borderTop: '1px solid #eaeaea', color: '#888' }}>
            <p>&copy; 2025 MyShop Inc. All rights reserved.</p>
        </footer>

      </div>
    </Router>
  );
}

export default App;