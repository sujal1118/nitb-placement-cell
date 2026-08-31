const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// SIGNUP route
router.post('/signup', async (req, res) => {
  try {
    const { name, rollNumber, branch, email, password } = req.body;

    if (!email.endsWith('@stu.manit.ac.in')) {
      return res.status(400).json({ error: 'Only MANIT college email addresses are allowed' });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newStudent = new Student({ name, rollNumber, branch, email, password });
    const saved = await newStudent.save();
    res.status(201).json({ message: 'Signup successful', student: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new student
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public branch-wise placement stats
router.get('/stats/branches', async (req, res) => {
  try {
    const students = await Student.find();
    const branchStats = {};

    students.forEach((s) => {
      if (!branchStats[s.branch]) {
        branchStats[s.branch] = { total: 0, placed: 0 };
      }
      branchStats[s.branch].total += 1;
      if (s.isPlaced) {
        branchStats[s.branch].placed += 1;
      }
    });

    const result = Object.keys(branchStats).map((branch) => ({
      branch,
      total: branchStats[branch].total,
      placed: branchStats[branch].placed,
      percentage: Math.round((branchStats[branch].placed / branchStats[branch].total) * 100)
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;