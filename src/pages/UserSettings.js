import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    contactEmail: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: ''
    },
    showContactInfo: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        contactEmail: user.contactEmail || '',
        socialMedia: user.socialMedia || {
          instagram: '',
          twitter: '',
          facebook: ''
        },
        showContactInfo: user.showContactInfo || false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.put('https://mern-final-project-mhenga254alexmwangi.onrender.com/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setMessage('Profile updated successfully!');
      // Refresh the page to get updated user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Remove unused variables or use them
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateToProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  if (!user) {
    return (
      <div className="auth-required">
        <div className="container">
          <h2>Login Required</h2>
          <p>Please login to update your profile.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-settings">
      <div className="container">
        <div className="settings-header">
          <h1>Profile Settings</h1>
          <div className="header-actions">
            <button onClick={handleNavigateToProfile} className="btn-secondary">
              View My Profile
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <p className="section-description">
              Choose what contact information you want to share with other users.
            </p>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showContactInfo"
                  checked={formData.showContactInfo}
                  onChange={handleChange}
                />
                Share my contact information with other users
              </label>
            </div>

            {formData.showContactInfo && (
              <>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Email for recipe inquiries"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number for contact"
                  />
                </div>

                <div className="form-group">
                  <label>Instagram Username</label>
                  <input
                    type="text"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="Your Instagram username"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter Username</label>
                  <input
                    type="text"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="Your Twitter username"
                  />
                </div>

                <div className="form-group">
                  <label>Facebook Username</label>
                  <input
                    type="text"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="Your Facebook username"
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;