const Enrollee = require("../models/enrollee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendmail");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const { CLIENT_URL } = process.env;

const enrollee = {
  forgotPassword: async (req, res) => {
    try {
      console.log("forgot pass");
      const { email } = req.body;
      const existingEnrollee = await Enrollee.findOne({ email });
      if (!existingEnrollee)
        return res.status(400).json({ msg: "That Email doesn't exist." });

      const resetToken = generateOTP();
      const access_token = createAccessToken({ id: existingEnrollee._id, resetToken });
      const url = `${CLIENT_URL}user/reset/${access_token}`;

      sendMail(email, url, existingEnrollee.name, "Reset your password");
      res.json({
        msg: "Reset password link has been sent to your email. Please check your inbox or spam folder.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password, resetToken } = req.body;
      const existingEnrollee = await Enrollee.findOne({ resetToken });

      if (!existingEnrollee)
        return res.status(400).json({ msg: "Invalid or expired reset token." });

      const passwordHash = await bcrypt.hash(password, 12);

      await Enrollee.findOneAndUpdate(
        { _id: existingEnrollee._id },
        {
          password: passwordHash,
          resetToken: "",
        }
      );
      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getEnrolleeInfo: async (req, res) => {
    try {
      const enrollee = await Enrollee.findById(req.user.id).select("-password");
      res.json(enrollee);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getEnrolleeAllInfo: async (req, res) => {
    try {
      const enrollees = await Enrollee.find().select("-password");
      res.json(enrollees);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateEnrolleeRole: async (req, res) => {
    try {
      const { role } = req.body;
      await Enrollee.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

function generateOTP() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

module.exports = enrollee;
