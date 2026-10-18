const express = require('express');
const {registerUser, loginUser} = require('../controllers/auth-controller')
const router = express.Router();


//all routes are related to auth-n-auth

router.post("/register", registerUser);
router.post("/login", loginUser)


module.exports = router;