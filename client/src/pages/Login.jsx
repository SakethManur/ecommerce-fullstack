import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5001/authentication/login', { email, password });
        
        localStorage.setItem('userId', response.data.userId);
        
        // --- ADD THIS LINE BELOW ---
        localStorage.setItem('role', response.data.role); 
        // ---------------------------

        alert("Login Successful!");
        navigate('/');
        window.location.reload(); 
    } catch (err) {
        alert("Login Failed: " + (err.response?.data?.error || "Invalid credentials"));
    }
};

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="email" placeholder="Email" 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    required style={{ padding: '8px' }} 
                />
                <input 
                    type="password" placeholder="Password" 
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                    required style={{ padding: '8px' }} 
                />
                <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>Login</button>
            </form>
            <p style={{ marginTop: '10px' }}>
                Don't have an account? <Link to="/create-account">Create one here</Link>
            </p>
        </div>
    );
}

export default Login;