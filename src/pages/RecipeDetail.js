import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchRecipe = useCallback(async () => {
    try {
      const response = await axios.get(`https://mern-final-project-mhenga254alexmwangi.onrender.com/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like recipes');
      return;
    }

    try {
      await axios.post(`https://mern-final-project-mhenga254alexmwangi.onrender.com/api/recipes/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchRecipe(); // Refresh recipe data
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`https://mern-final-project-mhenga254alexmwangi.onrender.com/api/recipes/${id}/comments`, {
        text: comment
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setComment('');
      fetchRecipe(); // Refresh recipe data
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="recipe-detail">
        <div className="container">
          <div className="loading">🍳 Loading recipe...</div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <div className="container">
          <div className="error">Recipe not found</div>
        </div>
      </div>
    );
  }

  const finalProductImage = recipe.images?.find(img => img.isFinalProduct);
  const otherImages = recipe.images?.filter(img => !img.isFinalProduct);
  const mainImage = finalProductImage || (recipe.images && recipe.images[0]);

  const isLiked = user && recipe.likes?.includes(user._id);

  return (
    <div className="recipe-detail">
      <div className="container">
        <Link to="/" className="back-link">
          ← Back to Recipes
        </Link>

        {/* Recipe Hero Section */}
        <div className="recipe-main">
          <div className="recipe-hero">
            {mainImage ? (
              <img 
                src={mainImage.url} 
                alt={recipe.title}
                className="recipe-hero-image"
              />
            ) : (
              <div className="recipe-hero-placeholder">
                🍳
              </div>
            )}
            <div className="recipe-hero-content">
              <h1>{recipe.title}</h1>
              <p className="recipe-description">{recipe.description}</p>
              
              <div className="recipe-meta-grid">
                <div className="meta-item">
                  <span className="label">Prep Time</span>
                  <span className="value">{recipe.prepTime} min</span>
                </div>
                <div className="meta-item">
                  <span className="label">Cook Time</span>
                  <span className="value">{recipe.cookTime} min</span>
                </div>
                <div className="meta-item">
                  <span className="label">Servings</span>
                  <span className="value">{recipe.servings}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Difficulty</span>
                  <span className="value">{recipe.difficulty}</span>
                </div>
              </div>

              <div className="recipe-actions">
                <button 
                  onClick={handleLike} 
                  className={`like-btn ${isLiked ? 'liked' : ''}`}
                >
                  {isLiked ? '❤️' : '🤍'} Like ({recipe.likes?.length || 0})
                </button>
              </div>
            </div>
          </div>

          {/* Author Section */}
          <div className="author-section">
            <div className="author-info">
              <div className="author-avatar">
                {recipe.author?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="author-details">
                <h4>By {recipe.author?.name || 'Unknown Chef'}</h4>
                <p>Recipe Creator</p>
              </div>
            </div>
            <Link to={`/profile/${recipe.author?._id}`} className="contact-author-btn">
              👤 View Profile
            </Link>
          </div>

          {/* Recipe Content Grid */}
          <div className="recipe-content-grid">
            <div className="ingredients-section">
              <h3>📋 Ingredients</h3>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h3>👨‍🍳 Instructions</h3>
              <ol className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Process Images Gallery */}
        {otherImages && otherImages.length > 0 && (
          <div className="process-images-section">
            <h3>📸 Cooking Process</h3>
            <div className="images-gallery">
              {otherImages.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img src={image.url} alt={image.caption || `Step ${index + 1}`} />
                  {image.caption && <p className="image-caption">{image.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Product Image */}
        {finalProductImage && (
          <div className="final-product-section">
            <h3>✨ Final Result</h3>
            <div className="final-product-image">
              <img src={finalProductImage.url} alt="Final dish" />
              {finalProductImage.caption && (
                <p className="final-caption">{finalProductImage.caption}</p>
              )}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="comments-section">
          <h3>💬 Comments ({recipe.comments?.length || 0})</h3>
          
          {user ? (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                rows="4"
              />
              <button type="submit" disabled={submitting || !comment.trim()}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div style={{textAlign: 'center', padding: '2rem', background: '#f8f9fa', borderRadius: '15px'}}>
              <p>
                <Link to="/login" style={{color: '#e74c3c', fontWeight: '600'}}>
                  Login
                </Link> to add comments and share your thoughts!
              </p>
            </div>
          )}

          <div className="comments-list">
            {recipe.comments?.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-author">
                  👤 <Link to={`/profile/${comment.author?._id}`}>
                    {comment.author?.name}
                  </Link>
                </div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
            
            {(!recipe.comments || recipe.comments.length === 0) && (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
