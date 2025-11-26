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
import Wishlist from './pages/Wishlist'; // <--- IMPORT WISHLIST

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
        
        {/* WRAPPER DIV */}
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
                
                {isLoggedIn && (
                    <>
                        <Link to="/ordered-items" style={{ textDecoration: 'none', color: '#555' }}>Orders</Link>
                        {/* WISHLIST LINK */}
                        <Link to="/wishlist" style={{ textDecoration: 'none', color: '#555' }}>Wishlist ❤️</Link>
                    </>
                )}

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
              <Route path="/wishlist" element={<Wishlist />} /> {/* <--- NEW ROUTE */}
              <Route path="/order" element={<Order />} />
              <Route path="/ordered-items" element={<OrderedItems />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
        </div>

        {/* FOOTER */}
        <footer style={{ background: '#222', color: '#fff', padding: '40px 20px', marginTop: 'auto' }}>
            <div style={{ textAlign: 'center', color: '#777', fontSize: '12px' }}>
                © 2025 My Shop Inc. All rights reserved.
            </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;