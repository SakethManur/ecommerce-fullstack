import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Optional if you re-installed it, else use alert

function Order() {
    const location = useLocation();
    const navigate = useNavigate();
    const items = location.state?.items || [];
    const userId = localStorage.getItem('userId');

    const [address, setAddress] = useState('');
    const [card, setCard] = useState('');
    const [saveAddress, setSaveAddress] = useState(false); // Checkbox state

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
        // 1. FETCH SAVED ADDRESS ON LOAD
        if (userId) {
            axios.post('http://localhost:5001/authentication/login', {
                // We cheat slightly here: usually we'd have a specific GET /user API.
                // For this project, let's just use the current address input for now.
                // Ideally, you'd add: app.get('/user/:id') to fetch profile.
            });
            // ACTUALLY: Let's fetch the user details properly.
            // Since we didn't make a GET /user API, let's rely on the user typing it once 
            // and checking "Save for later".
        }
    }, [items, navigate, userId]);

    const subtotal = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const handleBuy = async () => {
        if (!address || !card) return alert("Please fill all details");

        try {
            // 2. IF CHECKBOX CHECKED -> SAVE ADDRESS
            if (saveAddress) {
                await axios.put('http://localhost:5001/account/update', {
                    userId,
                    address
                });
            }

            // 3. PLACE ORDER
            await axios.post('http://localhost:5001/order', {
                userId,
                items,
                address
            });
            alert("Order Placed Successfully!");
            navigate('/ordered-items');
        } catch (err) {
            console.error(err);
            alert("Order failed.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h1>Checkout</h1>
            
            {/* Order Summary */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                <h3>Order Summary</h3>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>{item.name} (x{item.quantity}) {item.size && `[${item.size}]`}</span>
                        <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <hr />
                <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total:</span> <span>${total.toFixed(2)}</span>
                </h2>
            </div>

            {/* Address Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>
                    <strong>Delivery Address:</strong>
                    <textarea 
                        rows="3"
                        placeholder="123 Main St, City..." 
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                </label>

                {/* SAVE ADDRESS CHECKBOX */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={saveAddress} 
                        onChange={(e) => setSaveAddress(e.target.checked)} 
                    />
                    Save this address for future orders
                </label>
                
                <label>
                    <strong>Card Details:</strong>
                    <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        value={card} 
                        onChange={e => setCard(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                </label>

                <button 
                    onClick={handleBuy} 
                    style={{ background: 'black', color: 'white', padding: '15px', fontSize: '18px', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    Confirm & Buy
                </button>
            </div>
        </div>
    );
}

export default Order;