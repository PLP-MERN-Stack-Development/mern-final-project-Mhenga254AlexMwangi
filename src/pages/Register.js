import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Join QuickBite</h2>
              <p>Create your account and start sharing recipes</p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">✅</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
            
            <div className="auth-features">
              <div className="feature">
                <span className="feature-icon">🍳</span>
                <span>Share Recipes</span>
              </div>
              <div className="feature">
                <span className="feature-icon">👥</span>
                <span>Join Community</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Get Inspired</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
