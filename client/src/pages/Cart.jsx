import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            alert("Please login");
            navigate('/login');
        } else {
            fetchCart();
        }
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/cart?userId=${userId}`);
            setCartItems(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromCart = async (id) => {
        await axios.delete(`http://localhost:5001/cart/${id}`);
        fetchCart(); // Refresh list
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    };

    const handlePlaceOrder = () => {
        // We pass the cart items to the Order page using 'state'
        navigate('/order', { state: { items: cartItems } });
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? <p>Cart is empty</p> : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ 
                            borderBottom: '1px solid #eee', 
                            padding: '15px 0', 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center' 
                        }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <img 
                                    src={item.image_url} 
                                    alt={item.name} 
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} 
                                />
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                                    <p style={{ margin: 0, color: '#555' }}>${item.price} x {item.quantity}</p>
                                    
                                    {/* --- NEW: DISPLAY SELECTED SIZE --- */}
                                    {item.size && (
                                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#777', background: '#f0f0f0', display: 'inline-block', padding: '2px 8px', borderRadius: '4px' }}>
                                            Size: <strong>{item.size}</strong>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)} 
                                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    
                    <div style={{ marginTop: '30px', textAlign: 'right' }}>
                        <h2 style={{ fontSize: '24px' }}>Total: ${calculateTotal().toFixed(2)}</h2>
                        <button 
                            onClick={handlePlaceOrder} 
                            style={{ 
                                background: 'black', 
                                color: 'white', 
                                padding: '15px 40px', 
                                fontSize: '18px', 
                                border: 'none', 
                                cursor: 'pointer',
                                borderRadius: '5px',
                                marginTop: '10px'
                            }}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;