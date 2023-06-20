const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const  {activateEmail}  = require('../controllers/authController')
const {
    forgotPassword,
    resetPassword,
    getEnrolleeInfo,
    getEnrolleeAllInfo,
    updateEnrolleeRole
} = require('../controllers/enrolleeController');

router.get('/Profile/:id', authMiddleware, getEnrolleeInfo);
router.post('/Profile/:Id', authMiddleware, forgotPassword);
router.post('/Profile/:Id', authMiddleware, resetPassword);
router.get('/Profile/:Id', authMiddleware, getEnrolleeInfo);
router.get('/Profile/:Id', authMiddleware, getEnrolleeAllInfo);
router.put('/Profile/:Id', authMiddleware, updateEnrolleeRole);
router.post('/Profile/:Id', authMiddleware, activateEmail);



module.exports = router;
