require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(500).json({
      message: "No token provided, access denied"
    })
  }

  // decode this token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    console.log(decodedToken);

    req.userInfo = decodedToken;

    next();
  
  } catch (err) {
    console.log("JWT Error Name:", err.name);
    console.log("JWT Error Message:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}


module.exports = authMiddleware;