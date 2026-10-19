const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// register controller
const registerUser = async (req, res) => {
  try {

    //extract info from request body
    const { username, email, password, role } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "User already exists either with same username or email"
      })
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPasswd = await bcrypt.hash(password, salt);

    // create a new user in DB
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPasswd,
      role: role || 'user'
    })

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully!"
      })
    } else {
      res.status(400).json({
        success: false,
        message: "User registeration failed!"
      });
    }

  } catch (err) {

    console.log(err);
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong, plz try again later!'
    })
  }
}


// login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //checks if user is registered or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User doesnot exist!"
      })
    }

    //is the passwd is correct or not
    const isPasswdMatch = await bcrypt.compare(password, user.password);
    if (!isPasswdMatch) {
      return res.status(500).json({
        success: false,
        message: "Invalid credentials!"
      })
    }

    // create user token
    const accessToken = jwt.sign({
      userId : user._id,
      username : user.username,
      role : user.role
    }, process.env.JWT_SECRET_TOKEN, { expiresIn: '100m' });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken
    })


  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong, plz try again later!'
    })
  }
}

module.exports = { registerUser, loginUser };