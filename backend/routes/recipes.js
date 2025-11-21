const express = require('express');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

const router = express.Router();

// Get all recipes with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, difficulty, tags } = req.query;
    let query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    // Add image URL to response - FIXED VERSION
    const recipesWithImages = recipes.map(recipe => {
      let mainImage = null;
      
      // Use the first image if available
      if (recipe.images && recipe.images.length > 0) {
        mainImage = `http://localhost:5000/${recipe.images[0].url}`;
      }
      
      // Or use the final product image if marked
      const finalProductImage = recipe.images.find(img => img.isFinalProduct);
      if (finalProductImage) {
        mainImage = `http://localhost:5000/${finalProductImage.url}`;
      }

      return {
        ...recipe.toObject(),
        mainImage: mainImage
      };
    });

    res.json(recipesWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name')
      .populate('likes', 'name');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Get comments for this recipe
    const comments = await Comment.find({ recipe: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    // Add full image URLs
    const recipeWithImages = {
      ...recipe.toObject(),
      images: recipe.images.map(img => ({
        ...img.toObject(),
        url: `http://localhost:5000/${img.url}`
      })),
      comments
    };

    res.json(recipeWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new recipe with image upload (protected)
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    // Handle multer errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const { title, description, ingredients, instructions, prepTime, cookTime, servings, difficulty, tags } = req.body;

    // Process images
    const images = req.files ? req.files.map((file, index) => ({
      url: file.path,
      caption: req.body.captions ? req.body.captions[index] : '',
      isFinalProduct: req.body.isFinalProduct === index.toString()
    })) : [];

    const recipe = await Recipe.create({
      title,
      description,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      instructions: Array.isArray(instructions) ? instructions : [instructions],
      prepTime,
      cookTime,
      servings,
      difficulty,
      images,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',') : []),
      author: req.user._id
    });

    const populatedRecipe = await Recipe.findById(recipe._id).populate('author', 'name');
    
    // Add mainImage to the response for immediate display
    const responseRecipe = {
      ...populatedRecipe.toObject(),
      mainImage: images.length > 0 ? `http://localhost:5000/${images[0].url}` : null
    };
    
    res.status(201).json(responseRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    
    // Handle multer file size error specifically
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    
    res.status(400).json({ message: error.message || 'Error creating recipe' });
  }
});

// Add images to existing recipe (protected)
router.post('/:id/images', protect, upload.array('images', 5), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    // Handle multer errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    // Process new images
    const newImages = req.files ? req.files.map((file, index) => ({
      url: file.path,
      caption: req.body.captions ? req.body.captions[index] : '',
      isFinalProduct: req.body.isFinalProduct === index.toString()
    })) : [];

    recipe.images.push(...newImages);
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    console.error('Error adding images:', error);
    
    // Handle multer file size error specifically
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    
    res.status(400).json({ message: error.message || 'Error adding images' });
  }
});

// Like/unlike recipe (protected)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const alreadyLiked = recipe.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      // Unlike
      recipe.likes = recipe.likes.filter(like => like.toString() !== req.user._id.toString());
    } else {
      // Like
      recipe.likes.push(req.user._id);
    }

    await recipe.save();
    res.json({ likes: recipe.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment (protected)
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      author: req.user._id,
      recipe: req.params.id
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Serve uploaded images statically
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
