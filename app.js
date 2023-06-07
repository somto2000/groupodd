const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');
const authRoutes = require('./backend/routes/authRoutes');
const enrolleeRoutes = require('./backend/routes/enrolleeRoutes');
const courseRoutes = require('./backend/routes/courseRoutes');
const assessmentRoutes = require('./backend/routes/assessmentRoutes');
const rewardRoutes = require('./backend/routes/rewardRoutes');
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/enrollees', enrolleeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/rewards', rewardRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
