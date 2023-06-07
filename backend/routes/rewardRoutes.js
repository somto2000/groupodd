const express = require('express');
const router = express.Router();
const {
  getAllRewards,
  createReward,
  getReward,
  updateReward,
  deleteReward,
} = require('../controllers/rewardController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllRewards);
router.post('/', authMiddleware, createReward);
router.get('/:rewardId', getReward);
router.put('/:rewardId', authMiddleware, updateReward);
router.delete('/:rewardId', authMiddleware, deleteReward);

module.exports = router;