const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Enrollee = require('../models/enrollee');
const sendEmail = require('../controllers/sendmail');


const registerEnrollee = async (req, res) => {
  try {
    const { name, email, password, isTeacher } = req.body;
    console.log(isTeacher);
    // Check if the email is already registered
    if (!validateEmail(email))
      return res.status(400).json({ msg: "Invalid email" });
    const existingEnrollee = await Enrollee.findOne({ email });
    if (existingEnrollee) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let newEnrollee;

    if (isTeacher) {
      newEnrollee = {
        name,
        email,
        password: hashedPassword,
        Teacher: isTeacher,
      };
    } else {
      // Create a new enrollee
      newEnrollee = new Enrollee({ name, email, password: hashedPassword });
      await newEnrollee.save();
      console.log(newEnrollee);
    }

    // Generate and send OTP via email
    const otp = generateOTP();
    sendOTPByEmail(email, otp);

    res.status(200).json({
      msg: 'Register Success! Please enter the OTP sent to your email to complete the verification.',
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const activateEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Verify the OTP (you need to implement this function)
    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update the enrollee status as verified
    // ...

    res.json({ msg: 'Email verification successful!' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Helper function to generate OTP
function generateOTP() {
  // ...
  return '123456'; // Replace with your generated OTP
}

// Helper function to send OTP via email (you need to implement this function)
function sendOTPByEmail(email, otp) {
  console.log(`OTP: ${otp} is sent to ${email}`);
}

// Helper function to verify OTP (you need to implement this function)
function verifyOTP(email, otp) {
  // ...
  return otp === '123456'; // Replace with your OTP verification logic
}

const loginEnrollee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the enrollee exists
    const enrollee = await Enrollee.findOne({ email });
    if (!enrollee) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, enrollee.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // Generate a JWT token
    const token = jwt.sign({ enrolleeId: enrollee._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, enrollee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login enrollee' });
  };
  //   res.status(200).json({ /*result : existingEnrollee,*/ msg: "Login success" });
  // } catch (err) {
  //   return res.status(500).json({ msg: err.message });
  // }
},
  getAccessToken = async (req, res) => {
    try {
      //http://localhost:4000/user/refresh_token
      //get theCookie value
      const rf_token = req.cookies.refreshtoken;
      //console.log(rf_token)
      if (!rf_token) return res.status(500).json({ msg: "Please login now!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, enrollee) => {
        if (err) return res.status(500).json({ msg: "Please login now!" });
        // console.log(user);
        // if user login in create a token to stay loged in
        const access_token = createAccessToken({ id: enrollee.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };



const logoutEnrollee = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(400).json({ message: 'Logged out successfully' });
};
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
const createActivationToken = (payload) => {
  return jwt.sign(payload, `${process.env.ACTIVATION_TOKEN_SECRET}`, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "15m",
  });
};





module.exports = {
  registerEnrollee,
  loginEnrollee,
  logoutEnrollee,
  activateEmail,
  getAccessToken,
  sendEmail,
  generateOTP,
  sendOTPByEmail,
  verifyOTP,
};
