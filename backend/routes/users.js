const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user profile (public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's recipes
    const recipes = await Recipe.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Only show contact info if user allows it
    const userProfile = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      recipes: recipes,
      contactInfo: user.showContactInfo ? {
        contactEmail: user.contactEmail,
        phone: user.phone,
        socialMedia: user.socialMedia
      } : null
    };

    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (protected - own profile only)
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      name,
      bio,
      phone,
      contactEmail,
      socialMedia,
      showContactInfo
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        bio,
        phone,
        contactEmail,
        socialMedia,
        showContactInfo
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's recipes
router.get('/:id/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
