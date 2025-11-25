import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/authentication/create-account', formData);
            alert("Account created! Please login.");
            navigate('/login'); // Send user to login page
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || "Something went wrong"));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="firstName" placeholder="First Name" onChange={handleChange} required style={{ padding: '8px' }} />
                <input name="lastName" placeholder="Last Name" onChange={handleChange} required style={{ padding: '8px' }} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ padding: '8px' }} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ padding: '8px' }} />
                <button type="submit" style={{ padding: '10px', background: 'green', color: 'white', border: 'none' }}>Create Account</button>
            </form>
        </div>
    );
}

export default CreateAccount;