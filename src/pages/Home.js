import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchQuery = '') => {
    try {
      const url = searchQuery 
        ? `https://mern-final-project-mhenga254alexmwangi.onrender.com/api/recipes?search=${searchQuery}`
        : 'https://mern-final-project-mhenga254alexmwangi.onrender.com/api/recipes';
      
      const response = await axios.get(url);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(search);
  };

  // Function to get the display image for a recipe
  const getDisplayImage = (recipe) => {
    // If recipe has a mainImage from backend, use it
    if (recipe.mainImage) {
      return recipe.mainImage;
    }
    
    // If recipe has images array, use the first one
    if (recipe.images && recipe.images.length > 0) {
      return recipe.images[0].url;
    }
    
    // If no images, return null for placeholder
    return null;
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div 
      className="home"
      style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${process.env.PUBLIC_URL}/back.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="hero-section">
          <h1>Discover Amazing Recipes</h1>
          <p>Share your culinary creations with the world</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>

        <div className="recipes-grid">
          {recipes.map(recipe => {
            const displayImage = getDisplayImage(recipe);
            
            return (
              <div key={recipe._id} className="recipe-card">
                <div className="recipe-image">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={recipe.title}
                      onError={(e) => {
                        // If image fails to load, show placeholder
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`recipe-placeholder ${displayImage ? 'hidden' : ''}`}>
                    🍳
                  </div>
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
                    <span>👥 {recipe.servings} servings</span>
                    <span>📊 {recipe.difficulty}</span>
                  </div>
                  
                  <div className="recipe-author">
                    By {recipe.author?.name || 'Unknown'}
                  </div>
                  
                  <Link to={`/recipe/${recipe._id}`} className="view-recipe-btn">
                    View Recipe
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {recipes.length === 0 && (
          <div className="no-recipes">
            <h3>No recipes found</h3>
            <p>Be the first to share a recipe!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
