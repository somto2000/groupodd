const express = require('express');
const router = express.Router();
const { registerEnrollee, loginEnrollee, logoutEnrollee, activateEmail, getAccessToken, } = require('../controllers/authController');
const {
    forgotPassword,
    resetPassword,
    getEnrolleeInfo,
    getEnrolleeAllInfo,
    updateEnrolleeRole
} = require("../controllers/enrolleeController");

router.post('/register', registerEnrollee);
router.post('/login', loginEnrollee);
router.post('/logout', logoutEnrollee);
router.post('/forgot', forgotPassword);
router.post('/getprofile', resetPassword);
router.get('/getProfile', getEnrolleeInfo);
router.get('/getProfile', getEnrolleeAllInfo);
router.put('/updateProfile', updateEnrolleeRole);
router.post('/activation', activateEmail);
router.post('/refresh_token', getAccessToken);

module.exports = router;
