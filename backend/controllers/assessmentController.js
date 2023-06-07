const Assessment = require('../models/assessment');

// Get all assessments
const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
};

// Create a new assessment
const createAssessment = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const assessment = await Assessment.create({ title, questions });
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assessment' });
  }
};

// Get a single assessment
const getAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
};

// Update an assessment
const updateAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { title, questions } = req.body;
    const assessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      { title, questions },
      { new: true }
    );
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assessment' });
  }
};

// Delete an assessment
const deleteAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findByIdAndDelete(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
};

module.exports = {
  getAllAssessments,
  createAssessment,
  getAssessment,
  updateAssessment,
  deleteAssessment,
};
