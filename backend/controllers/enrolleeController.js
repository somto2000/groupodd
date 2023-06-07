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
      /* forgotPassword: if click to forgotPwd btn  - we  send a email  and a req with the token_code(user)
       */
      console.log("forgot pass");
      const { email } = req.body;
      const existingEnrollee = await Enrollee.findOne({ email });
      if (!existingEnrollee)
        return res.status(400).json({ msg: "That Email doesn't exist." });

      const access_token = createAccessToken({ id: existingEnrollee._id });
      const url = `${CLIENT_URL}user/reset/${access_token}`;

      sendMail(email, url, existingEnrollee.name, "Reset your password");
      res.json({
        msg: "Re-send the password, please check your email inbox or spam.",
      }); //seccess
    } catch (err) {
      return res.status(500).json({ msg: err.message }); //err
    }
  },
  resetPassword: async (req, res) => {
    //after pass through middleware and verfey that the token in header value
    //we modify the pwd
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);
      //{ id: '609b416cbed92c4798c17f49', iat: 1620867631, exp: 1620868531 }
      await Users.findOneAndUpdate(
        { _id: req.enrollee.id },
        {
          password: passwordHash,
        }
      );
      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getEnrolleeInfor: async (req, res) => {
    try {
      const user = await Enrollees.findById(req.user.id).select("-password");
      console.log(enrollee);
      res.json(enrollee);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getEnrolleeAllInfor: async (req, res) => {
    try {
      const enrollee = await Enrollees.find().select("-password");
      res.json(enrollee);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateEnrolleerole: async (req, res) => {
    try {
      const { name, description, headline } = req.body;
      console.log("req body user", req.body);
      const enrollee = await Enrollees.findById(req.enrollee.id);
      console.log("find the enrollee", enrollee);
      if (user) {
        user.name = name || enrollee.name;
        user.description = description ||enrollee.description;
        enrollee.headline = headline || enrollee.headline;
      }
      const updatedEnrollee = await enrollee.save();
      res.json({ msg: "Update Enrollee Success!" });
      console.log("Update of enrollee info success");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateEnrolleerole: async (req, res) => {
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
  

  module.exports = enrollee;
