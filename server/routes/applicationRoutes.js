const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Student = require('../models/Student');

// Apply to a drive
router.post('/', async (req, res) => {
  try {
    const { student, drive } = req.body;

    const studentDoc = await Student.findById(student);
    if (studentDoc.isPlaced) {
      return res.status(400).json({ error: 'You are already placed and cannot apply further.' });
    }

    const existing = await Application.findOne({ student, drive });
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this drive.' });
    }

    const newApplication = new Application({ student, drive });
    const saved = await newApplication.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get applications for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const applications = await Application.find({ student: req.params.studentId })
      .populate({ path: 'drive', populate: { path: 'company' } });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all applications (for admin, filtered by drive)
router.get('/drive/:driveId', async (req, res) => {
  try {
    const applications = await Application.find({ drive: req.params.driveId })
      .populate('student');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status (mark selected/rejected)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If selected, mark student as placed
    if (req.body.status === 'selected') {
      const application = await Application.findById(req.params.id).populate('drive');
      await Student.findByIdAndUpdate(application.student, {
        isPlaced: true,
        placedCompany: application.drive.company
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;