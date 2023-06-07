const express = require('express');
const router = express.Router();
const {
  getAllAssessments,
  createAssessment,
  getAssessment,
  updateAssessment,
  deleteAssessment,
} = require('../controllers/assessmentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllAssessments);
router.post('/', authMiddleware, createAssessment);
router.get('/:assessmentId', getAssessment);
router.put('/:assessmentId', authMiddleware, updateAssessment);
router.delete('/:assessmentId', authMiddleware, deleteAssessment);

module.exports = router;
