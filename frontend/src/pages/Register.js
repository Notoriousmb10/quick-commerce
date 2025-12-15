import React, { useState, useContext } from 'react';

import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const { register } = useContext(AuthContext);



    const validateForm = () => {
        if (name.trim().length < 2) {
            toast.error("Name must be at least 2 characters long");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await register(name, email, password, role);
            toast.success('Registration successful!');
            

            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '3rem auto' }} className="card">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #e2e8f0' }}
                    >
                        <option value="customer">Customer</option>
                        <option value="partner">Delivery Partner</option>
                        {/* Admin usually created manually or via secret */}
                    </select>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
