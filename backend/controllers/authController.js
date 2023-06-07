const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Enrollee = require('../models/enrollee');
const sendmail = require('../controllers/sendmail');

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
    if (isTeacher) {
      newUser = {
        name,
        email,
        password: passwordHash,
        Teacher: isTeacher,
      };
    } else {
      // Create a new enrollee
      const enrollee = new Enrollee({ name, email, password: hashedPassword });
      await enrollee.save();
      console.log(enrollee);
    };

    const activation_token = createActivationToken(newEnrollee);

    const url = `${CLIENT_URL}user/activate/${activation_token}`;
    sendMail(email, url, name, "Verify your email address");

    res.status(200).json({
      msg: "Register Success! Please activate your email to start.",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},
  activateEmail = async (req, res) => {
    try {
      //http://localhost:5000/user/activation
      /*register : after the user set the fields we send a request to check 
            if evryething fine and the email not already in DB and set the token with user 
            */
      /* activateEmail: if click to the lien of email that we send it  -  send a req with the token_code(user)
       */
      const { activation_token } = req.body;
      const enrollee = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );
      /*console.log(user);
            //that user contain all fields {
            name: 'User 01',
             email: 'somtoo01@gmail.com',
             password: '$2b$12$6fOX2Q6gm4Fc9yX.HxmX6e0//dlsO2LbYG6m6rmzecOvfv4BAr3a.',
             iat: 1620786747,
             exp: 1620787347
            }*/
      const { name, email, password, Teacher, description, headline } = enrollee;
      //check if the enrollee already registred
      const check = await Enrollee.findOne({ email });
      if (check)
        return res.status(400).json({ msg: "This email already exist" });
      //if not create one and save it to DB
      if (Teacher) {
        const newEnrollee = new Enrollee({
          name,
          email,
          password,
          Teacher,
          description,
          headline,
        });
        await newEnrollee.save();
        res.json({ msg: "Account has been activated!" });
      } else {
        const newEnrollee = new Enrollee({ name, email, password });
        await newEnrollee.save();
        res.json({ msg: "Account has been activated!" });
      }
      // Generate a JWT token
      const token = jwt.sign({ enrolleeId: enrollee._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.status(201).json({
        success: true,
        enrollee,
        token
      });
  // catch (error) {
  //       res.status(500).json({ error: 'Failed to register enrollee' });
  //     }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

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
  sendmail,
};
