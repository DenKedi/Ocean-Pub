const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/AsyncHandler');
const Event = require('../models/Event');
const Category = require('../models/Category');

// @route   GET /api/events
// @desc    Get all events (with optional category filter and date range)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { category, startDate, endDate, limit = 50, page = 1 } = req.query;
  
  const query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) query.startTime.$gte = new Date(startDate);
    if (endDate) query.startTime.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const events = await Event.find(query)
    .populate('category', 'name defaultImageUrl color')
    .sort({ startTime: 1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Event.countDocuments(query);

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: events
  });
}));

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('category', 'name defaultImageUrl color description');

  if (!event) {
    return res.status(404).json({
      success: false,
      error: 'Event nicht gefunden'
    });
  }

  res.status(200).json({
    success: true,
    data: event
  });
}));

// @route   POST /api/events
// @desc    Create new event
// @access  Private (requires authentication)
router.post('/', asyncHandler(async (req, res) => {
  // Verify category exists
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Kategorie nicht gefunden'
    });
  }

  const event = await Event.create(req.body);
  await event.populate('category', 'name defaultImageUrl color');

  res.status(201).json({
    success: true,
    data: event
  });
}));

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (requires authentication)
router.put('/:id', asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      error: 'Event nicht gefunden'
    });
  }

  // If category is being updated, verify it exists
  if (req.body.category && req.body.category !== event.category.toString()) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Kategorie nicht gefunden'
      });
    }
  }

  event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name defaultImageUrl color');

  res.status(200).json({
    success: true,
    data: event
  });
}));

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (requires authentication)
router.delete('/:id', asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      error: 'Event nicht gefunden'
    });
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Event gelöscht'
  });
}));

module.exports = router;
