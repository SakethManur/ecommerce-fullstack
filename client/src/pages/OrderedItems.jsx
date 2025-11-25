import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrderedItems() {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/ordered-items?userId=${userId}`);
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };
        if(userId) fetchOrders();
    }, []);

    const orderAgain = async (item) => {
        try {
            await axios.post('http://localhost:5001/cart', {
                userId,
                productId: item.id || item.product_id, // Safety check for ID
                quantity: 1
            });
            alert(`${item.name} added to cart!`);
            navigate('/cart');
        } catch (err) {
            alert("Could not add to cart");
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1>My Past Orders</h1>
            {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '25px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    
                    {/* --- UPDATED ORDER HEADER WITH STATUS BADGE --- */}
                    <div style={{ 
                        background: '#f8f9fa', 
                        padding: '15px', 
                        marginBottom: '15px', 
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>Order #{order.id}</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                                <strong>Total:</strong> ${order.total_price} <span style={{ margin: '0 10px' }}>|</span> 
                                <strong>Arriving:</strong> {new Date(order.delivery_date).toDateString()}
                            </p>
                        </div>

                        {/* STATUS BADGE */}
                        <div style={{ 
                            padding: '8px 16px', 
                            borderRadius: '20px', 
                            fontWeight: 'bold',
                            fontSize: '14px',
                            background: order.status === 'Pending' ? '#fff3cd' : order.status === 'Shipped' ? '#cce5ff' : '#d4edda',
                            color: order.status === 'Pending' ? '#856404' : order.status === 'Shipped' ? '#004085' : '#155724',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            {order.status || 'Pending'}
                        </div>
                    </div>

                    {/* Order Items List */}
                    <div>
                        <h4 style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Items:</h4>
                        {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {/* Optional: Show small image if available in item data */}
                                    {item.image_url && <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />}
                                    
                                    <div>
                                        <span style={{ fontWeight: '500' }}>{item.name}</span>
                                        {item.size && <span style={{ marginLeft: '8px', fontSize: '12px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{item.size}</span>}
                                        <div style={{ fontSize: '13px', color: '#888' }}>${item.price} x {item.quantity}</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => orderAgain(item)}
                                    style={{ 
                                        background: 'white', 
                                        color: '#e67e22', 
                                        border: '1px solid #e67e22', 
                                        padding: '5px 12px', 
                                        cursor: 'pointer', 
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => { e.target.style.background = '#e67e22'; e.target.style.color = 'white'; }}
                                    onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = '#e67e22'; }}
                                >
                                    Buy Again
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </div>
    );
}

export default OrderedItems;