import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [imageCaptions, setImageCaptions] = useState([]);
  const [finalProductIndex, setFinalProductIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImageCaptions(files.map(() => ''));
  };

  const handleCaptionChange = (index, value) => {
    const newCaptions = [...imageCaptions];
    newCaptions[index] = value;
    setImageCaptions(newCaptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to create recipes');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach(item => {
            submitData.append(key, item);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach((image, index) => {
        submitData.append('images', image);
        submitData.append('captions', imageCaptions[index]);
        if (index === finalProductIndex) {
          submitData.append('isFinalProduct', index);
        }
      });

      await axios.post('https://mern-final-project-mhenga254alexmwangi.onrender.com/api/recipes', submitData, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating recipe');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-required">
        <div className="container">
          <h2>Login Required</h2>
          <p>Please login to create recipes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-recipe">
      <div className="container">
        <h1>Create New Recipe</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label>Recipe Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prep Time (minutes)</label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cook Time (minutes)</label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Recipe Images (Max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>Select images of your cooking process and final result</small>

            {images.length > 0 && (
              <div className="image-previews">
                {images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                    <input
                      type="text"
                      placeholder="Image caption"
                      value={imageCaptions[index]}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                    />
                    <label className="final-product-check">
                      <input
                        type="radio"
                        name="finalProduct"
                        checked={finalProductIndex === index}
                        onChange={() => setFinalProductIndex(index)}
                      />
                      Final Result
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="array-field">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  required
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('ingredients', index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('ingredients')}
              className="add-btn"
            >
              Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="array-field">
                <textarea
                  value={instruction}
                  onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required
                  rows="2"
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('instructions', index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('instructions')}
              className="add-btn"
            >
              Add Step
            </button>
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., vegetarian, quick, healthy"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating Recipe...' : 'Create Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
