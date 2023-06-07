const express = require('express');
const router = express.Router();
const { registerEnrollee, loginEnrollee, logoutEnrollee, activateEmail, getAccessToken, } = require('../controllers/authController');
const {
    forgotPassword,
    resetPassword,
    getEnrolleeInfor,
    getEnrolleeAllInfor,
    updateEnrolleerole
} = require("../controllers/enrolleeController");

router.post('/register', registerEnrollee);
router.post('/login', loginEnrollee);
router.post('/logout', logoutEnrollee);
router.post('/forgot', forgotPassword);
router.post('/getprofile', resetPassword);
router.get('/getProfile', getEnrolleeInfor);
router.get('/getProfile', getEnrolleeAllInfor);
router.put('/updateProfile', updateEnrolleerole);
router.post('/activation', activateEmail);
router.post('/refresh_token', getAccessToken);

module.exports = router;
