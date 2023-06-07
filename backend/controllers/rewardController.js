const Reward = require('../models/reward');

// Get all rewards
const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
};

// Create a new reward
const createReward = async (req, res) => {
  try {
    const { title, description } = req.body;
    const reward = await Reward.create({ title, description });
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reward' });
  }
};

// Get a single reward
const getReward = async (req, res) => {
  try {
    const { rewardId } = req.params;
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reward' });
  }
};

// Update a reward
const updateReward = async (req, res) => {
  try {
    const { rewardId } = req.params;
    const { title, description } = req.body;
    const reward = await Reward.findByIdAndUpdate(
      rewardId,
      { title, description },
      { new: true }
    );
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reward' });
  }
};

// Delete a reward
const deleteReward = async (req, res) => {
  try {
    const { rewardId } = req.params;
    const reward = await Reward.findByIdAndDelete(rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    res.json({ message: 'Reward deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reward' });
  }
};

module.exports = {
  getAllRewards,
  createReward,
  getReward,
  updateReward,
  deleteReward,
};
