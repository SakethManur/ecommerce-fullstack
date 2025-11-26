import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Wishlist() {
    const [items, setItems] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/wishlist?userId=${userId}`);
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Wishlist ❤️</h1>
            
            {items.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777' }}>No items saved yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {items.map(item => (
                        <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            
                            <Link to={`/product/${item.product_id || item.id}`}>
                                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
                            </Link>
                            
                            <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{item.name}</h3>
                            <p style={{ fontWeight: 'bold', color: '#555' }}>${item.price}</p>
                            
                            <Link 
                                to={`/product/${item.product_id || item.id}`} 
                                style={{ display: 'block', marginTop: '10px', textDecoration: 'none', background: 'black', color: 'white', padding: '8px', borderRadius: '5px', fontSize: '14px' }}
                            >
                                View Product
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;