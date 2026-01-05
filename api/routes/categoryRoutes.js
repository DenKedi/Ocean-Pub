const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/AsyncHandler');
const Category = require('../models/Category');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
}));

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Kategorie nicht gefunden'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
}));

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (requires authentication)
router.post('/', asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
}));

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (requires authentication)
router.put('/:id', asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Kategorie nicht gefunden'
    });
  }

  category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: category
  });
}));

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (requires authentication)
router.delete('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Kategorie nicht gefunden'
    });
  }

  // Check if category is being used by events
  const Event = require('../models/Event');
  const eventsCount = await Event.countDocuments({ category: req.params.id });

  if (eventsCount > 0) {
    return res.status(400).json({
      success: false,
      error: `Kategorie kann nicht gelöscht werden. ${eventsCount} Event(s) verwenden diese Kategorie.`
    });
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Kategorie gelöscht'
  });
}));

module.exports = router;
