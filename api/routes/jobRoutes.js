const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/AsyncHandler');

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const jobs = await Job.find().sort({ date_created: -1 });
    res.json(jobs);
}));

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private
router.post('/', auth, asyncHandler(async (req, res) => {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
}));

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const job = await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!job) {
        return res.status(404).json({ msg: 'Job nicht gefunden' });
    }
    res.json(job);
}));

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ msg: 'Job nicht gefunden' });
    }
    await job.deleteOne();
    res.json({ msg: 'Job entfernt' });
}));

module.exports = router;
