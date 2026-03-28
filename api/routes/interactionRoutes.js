const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/AsyncHandler');
const auth = require('../middleware/auth');
const Interaction = require('../models/Interaction');

const VALID_BUTTON_TYPES = ['link', 'mehr_infos', 'alle_events', 'category_filter'];

// Anonymizes IP: keeps first 3 octets, replaces last with 0
// For IPv6, replaces the last group with 0
function anonymizeIp(ip) {
  if (!ip) return null;
  // Strip ::ffff: prefix for IPv4-mapped IPv6
  const cleaned = ip.replace(/^::ffff:/, '');
  // IPv4
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(cleaned)) {
    return cleaned.replace(/\.\d+$/, '.0');
  }
  // IPv6
  const parts = cleaned.split(':');
  if (parts.length > 1) {
    parts[parts.length - 1] = '0';
    return parts.join(':');
  }
  return null;
}

// @route   POST /api/interactions
// @desc    Track a user interaction (button click)
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const { eventId, buttonType, sessionId, metadata } = req.body;

  if (!buttonType || !VALID_BUTTON_TYPES.includes(buttonType)) {
    return res.status(400).json({ success: false, message: 'Invalid or missing buttonType' });
  }

  if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 128) {
    return res.status(400).json({ success: false, message: 'Invalid or missing sessionId' });
  }

  const ipAddress = anonymizeIp(req.ip);

  const interaction = new Interaction({
    eventId: eventId || null,
    buttonType,
    sessionId,
    ipAddress,
    metadata: metadata || {}
  });

  await interaction.save();

  res.status(201).json({ success: true });
}));

// @route   GET /api/interactions/stats
// @desc    Get aggregated interaction statistics
// @access  Private
router.get('/stats', auth, asyncHandler(async (req, res) => {
  const { range } = req.query;

  const matchStage = {};
  const now = new Date();

  if (range === '7d') {
    matchStage.timestamp = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
  } else if (range === '30d') {
    matchStage.timestamp = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
  }

  const [totalResult, byButtonType, topEventsRaw] = await Promise.all([
    // Total click count
    Interaction.countDocuments(matchStage),

    // Group by buttonType
    Interaction.aggregate([
      { $match: matchStage },
      { $group: { _id: '$buttonType', count: { $sum: 1 } } }
    ]),

    // Events sorted chronologically
    Interaction.aggregate([
      { $match: { ...matchStage, eventId: { $ne: null } } },
      {
        $group: {
          _id: '$eventId',
          total: { $sum: 1 },
          link: { $sum: { $cond: [{ $eq: ['$buttonType', 'link'] }, 1, 0] } },
          mehr_infos: { $sum: { $cond: [{ $eq: ['$buttonType', 'mehr_infos'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          total: 1,
          link: 1,
          mehr_infos: 1,
          eventTitle: '$event.title',
          eventStartTime: '$event.startTime',
          eventImageUrl: '$event.eventImageUrl',
          eventLinkUrl: '$event.link_url'
        }
      },
      { $sort: { eventStartTime: 1 } }
    ])
  ]);

  const byButtonTypeMap = {};
  for (const item of byButtonType) {
    byButtonTypeMap[item._id] = item.count;
  }

  res.json({
    success: true,
    totalClicks: totalResult,
    byButtonType: byButtonTypeMap,
    events: topEventsRaw
  });
}));

// @route   GET /api/interactions/stats/events/:id
// @desc    Get click stats for a specific event
// @access  Private
router.get('/stats/events/:id', auth, asyncHandler(async (req, res) => {
  const { range } = req.query;
  const matchStage = { eventId: require('mongoose').Types.ObjectId.createFromHexString(req.params.id) };
  const now = new Date();

  if (range === '7d') {
    matchStage.timestamp = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
  } else if (range === '30d') {
    matchStage.timestamp = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
  }

  const stats = await Interaction.aggregate([
    { $match: matchStage },
    { $group: { _id: '$buttonType', count: { $sum: 1 } } }
  ]);

  const result = {};
  for (const item of stats) {
    result[item._id] = item.count;
  }

  res.json({ success: true, eventId: req.params.id, byButtonType: result });
}));

module.exports = router;
