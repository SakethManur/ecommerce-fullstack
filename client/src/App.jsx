import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Order from './pages/Order';
import OrderedItems from './pages/OrderedItems';
import CreateAccount from './pages/CreateAccount';
import ProductDetails from './pages/ProductDetails';
import Admin from './pages/Admin';

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
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        
        {/* WRAPPER DIV with padding for the main content */}
        <div style={{ flex: 1, padding: '20px' }}>
            
            {/* NAVIGATION BAR */}
            <nav style={{ 
                marginBottom: '20px', 
                borderBottom: '1px solid #ccc', 
                paddingBottom: '15px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: '#fff' 
            }}>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold', fontSize: '20px' }}>
                    🛍️ MY SHOP
                </Link>
                <Link to="/" style={{ textDecoration: 'none', color: '#555' }}>Home</Link>
                <Link to="/cart" style={{ textDecoration: 'none', color: '#555' }}>Cart</Link>
                {isLoggedIn && <Link to="/ordered-items" style={{ textDecoration: 'none', color: '#555' }}>Orders</Link>}
                {isAdmin && (
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'red', fontWeight: 'bold', border: '1px solid red', padding: '5px 10px', borderRadius: '5px' }}>
                        ADMIN PANEL
                    </Link>
                )}
              </div>
              
              <div>
                {isLoggedIn ? (
                  <button onClick={handleLogout} style={{ cursor: 'pointer', background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px' }}>Logout</button>
                ) : (
                  <Link to="/login" style={{ textDecoration: 'none', color: 'white', background: '#3498db', padding: '8px 15px', borderRadius: '4px' }}>Login</Link>
                )}
              </div>

            </nav>

            {/* ROUTES */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/ordered-items" element={<OrderedItems />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
        </div>

        {/* --- FOOTER SECTION (NEW!) --- */}
        <footer style={{ background: '#222', color: '#fff', padding: '40px 20px', marginTop: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                
                {/* Column 1 */}
                <div>
                    <h3>🛍️ My Shop</h3>
                    <p style={{ color: '#aaa', fontSize: '14px' }}>The best place to find summer trends, electronics, and home essentials.</p>
                </div>

                {/* Column 2 */}
                <div>
                    <h4>Shop</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#aaa', lineHeight: '2' }}>
                        <li><Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>All Products</Link></li>
                        <li><Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>Electronics</Link></li>
                        <li><Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>Fashion</Link></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div>
                    <h4>Support</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#aaa', lineHeight: '2' }}>
                        <li>Contact Us</li>
                        <li>FAQs</li>
                        <li>Return Policy</li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div>
                    <h4>Follow Us</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <span>📘</span>
                        <span>📷</span>
                        <span>🐦</span>
                    </div>
                </div>
            </div>
            
            <div style={{ textAlign: 'center', borderTop: '1px solid #444', marginTop: '30px', paddingTop: '20px', color: '#777', fontSize: '12px' }}>
                © 2025 My Shop Inc. All rights reserved.
            </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;