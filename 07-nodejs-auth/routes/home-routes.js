const express = require('express');

const router = express.Router();

router.get('/welcome', (req, res) => {

  const { userId, username, role } = req.userInfo;

  res.json({
    message: "Welcome to home page",
    user: {
      _id: userId,
      username: username,
      role: role
    }
  })
});

module.exports = router;