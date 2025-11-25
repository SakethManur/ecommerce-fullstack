import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
    // Product Form State
    const [formData, setFormData] = useState({
        name: '', 
        price: '', 
        category: 'Electronics', 
        description: '', 
        image_url: '', 
        stock: 10 // Default stock
    });

    // Orders State
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5001/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5001/admin/order/${orderId}/status`, { status: newStatus });
            alert(`Order #${orderId} marked as ${newStatus}`);
            fetchOrders(); // Refresh list to show new status
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/products', formData);
            alert("Product Added!");
            // Reset form
            setFormData({ name: '', price: '', category: 'Electronics', description: '', image_url: '', stock: 10 });
        } catch (err) {
            alert("Failed to add product");
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <h1>Admin Panel</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                
                {/* LEFT COLUMN: ADD PRODUCT */}
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                    <h3>Add Product</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        
                        <label>Product Name:</label>
                        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={{ padding: '8px' }} />
                        
                        <label>Price ($):</label>
                        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required style={{ padding: '8px' }} />
                        
                        <label>Image URL:</label>
                        <input name="image_url" placeholder="https://..." value={formData.image_url} onChange={handleChange} required style={{ padding: '8px' }} />
                        
                        <label>Category:</label>
                        <select name="category" value={formData.category} onChange={handleChange} style={{ padding: '8px' }}>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Home</option>
                            <option>Lifestyle</option>
                        </select>

                        {/* --- STOCK INPUT (FIXED) --- */}
                        <label>Stock Quantity:</label>
                        <input 
                            name="stock" 
                            type="number" 
                            placeholder="Stock (e.g., 10)" 
                            value={formData.stock} 
                            onChange={handleChange} 
                            required 
                            style={{ padding: '8px' }} 
                        />

                        <label>Description:</label>
                        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ padding: '8px' }} />

                        <button type="submit" style={{ marginTop: '10px', padding: '10px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            ADD PRODUCT
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: ORDER MANAGEMENT */}
                <div>
                    <h3>Recent Orders</h3>
                    {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
                        <div key={order.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Order #{order.id}</strong>
                                <span style={{ 
                                    padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold',
                                    background: order.status === 'Pending' ? '#ffeeba' : order.status === 'Shipped' ? '#b8daff' : '#c3e6cb',
                                    color: order.status === 'Pending' ? '#856404' : order.status === 'Shipped' ? '#004085' : '#155724'
                                }}>
                                    {order.status}
                                </span>
                            </div>
                            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Customer:</strong> {order.first_name} ({order.email})</p>
                            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Total:</strong> ${order.total_price}</p>
                            
                            <div style={{ marginTop: '10px' }}>
                                <small>Update Status: </small>
                                <button onClick={() => handleStatusChange(order.id, 'Shipped')} style={{ marginRight: '5px', cursor: 'pointer', padding: '5px' }}>Ship 🚚</button>
                                <button onClick={() => handleStatusChange(order.id, 'Delivered')} style={{ cursor: 'pointer', padding: '5px' }}>Deliver ✅</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Admin;