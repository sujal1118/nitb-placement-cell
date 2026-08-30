const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');

router.get('/', async (req, res) => {
  try {
    const drives = await Drive.find().populate('company');
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newDrive = new Drive(req.body);
    const saved = await newDrive.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Drive.findByIdAndDelete(req.params.id);
    res.json({ message: 'Drive deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;