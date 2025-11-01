import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/authUtils.js';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineX } from 'react-icons/hi';
import '../components/AuthModal.css';

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        if (isRegister) {
            const result = registerUser(username, password);
            setMessage(result.message);
            if (result.success) {
                setIsRegister(false);
            }
        } else {
            const result = loginUser(username, password);
            setMessage(result.message);
            if (result.success) {
                onLoginSuccess(result.username);
                onClose();
            }
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-content">
                <button className="auth-modal-close" onClick={onClose}>
                    <HiOutlineX />
                </button>
                <h3>{isRegister ? 'Registrasi Akun Baru' : 'Login ke Akun Anda'}</h3>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <HiOutlineUser />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <HiOutlineLockClosed />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {message && <p className={`auth-message ${message.includes('Berhasil') ? 'success' : 'error'}`}>{message}</p>}

                    <button type="submit" className="auth-submit-button">
                        {isRegister ? 'Daftar' : 'Masuk'}
                    </button>
                </form>

                <p className="auth-switch">
                    {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
                    <a href="#" onClick={(e) => {e.preventDefault(); setIsRegister(prev => !prev);}}>
                        {isRegister ? 'Login di sini' : 'Daftar sekarang'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;