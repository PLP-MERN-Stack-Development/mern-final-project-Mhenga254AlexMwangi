import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get(`https://mern-final-project-mhenga254alexmwangi.onrender.com/api/users/${id}`);
      setUser(response.data);
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }, [id]); // Add id as dependency

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]); // Now fetchUserProfile is stable due to useCallback

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h1>{user.name}</h1>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <p className="member-since">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            
            {user.contactInfo && (
              <div className="contact-section">
                <h3>Contact Information</h3>
                <div className="contact-methods">
                  {user.contactInfo.contactEmail && (
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <a href={`mailto:${user.contactInfo.contactEmail}`}>
                        {user.contactInfo.contactEmail}
                      </a>
                    </div>
                  )}
                  
                  {user.contactInfo.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <a href={`tel:${user.contactInfo.phone}`}>
                        {user.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  
                  {user.contactInfo.socialMedia && (
                    <div className="social-links">
                      {user.contactInfo.socialMedia.instagram && (
                        <a 
                          href={`https://instagram.com/${user.contactInfo.socialMedia.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          📷 Instagram
                        </a>
                      )}
                      
                      {user.contactInfo.socialMedia.twitter && (
                        <a 
                          href={`https://twitter.com/${user.contactInfo.socialMedia.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          🐦 Twitter
                        </a>
                      )}
                      
                      {user.contactInfo.socialMedia.facebook && (
                        <a 
                          href={`https://facebook.com/${user.contactInfo.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          👥 Facebook
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!user.contactInfo && (
              <div className="no-contact-info">
                <p>This user has not shared contact information.</p>
              </div>
            )}
          </div>
        </div>

        <div className="user-recipes">
          <h2>Recipes by {user.name}</h2>
          
          {recipes.length > 0 ? (
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <div key={recipe._id} className="recipe-card">
                  <div className="recipe-image">
                    {recipe.mainImage ? (
                      <img src={recipe.mainImage} alt={recipe.title} />
                    ) : (
                      <div className="recipe-placeholder">🍳</div>
                    )}
                  </div>
                  
                  <div className="recipe-content">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-description">
                      {recipe.description.length > 100 
                        ? `${recipe.description.substring(0, 100)}...` 
                        : recipe.description}
                    </p>
                    
                    <div className="recipe-meta">
                      <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span>📊 {recipe.difficulty}</span>
                    </div>
                    
                    <Link to={`/recipe/${recipe._id}`} className="view-recipe-btn">
                      View Recipe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-recipes">
              <p>No recipes shared yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;