const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const  {activateEmail}  = require('../controllers/authController')
const {
    forgotPassword,
    resetPassword,
    getEnrolleeInfor,
    getEnrolleeAllInfor,
    updateEnrolleerole
} = require('../controllers/enrolleeController');

router.get('/Profile/:id', authMiddleware, getEnrolleeInfor);
router.put('/Profile/:Id', authMiddleware, updateEnrolleerole);
router.post('/Profile/:Id', authMiddleware, forgotPassword);
router.post('/Profile/:Id', authMiddleware, resetPassword);
router.get('/Profile/:Id', authMiddleware, getEnrolleeInfor);
router.get('/Profile/:Id', authMiddleware, getEnrolleeAllInfor);
router.put('/Profile/:Id', authMiddleware, updateEnrolleerole);
router.post('/Profile/:Id', authMiddleware, activateEmail);



module.exports = router;
