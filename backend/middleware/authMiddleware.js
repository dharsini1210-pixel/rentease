const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB
      req.user = await User.findById(decoded.id).select("-password");

      next();

    } catch (error) {
      console.log("❌ AUTH ERROR:", error);

      return res.status(401).json({
        message: "Not authorized",
      });
    }

  } else {
    return res.status(401).json({
      message: "No token provided",
    });
  }
};

module.exports = { protect };