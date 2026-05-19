const express = require("express");
const router = express.Router();

// ✅ import BOTH functions
const { registerUser, loginUser } = require("../controllers/userController");

// ✅ register route
router.post("/register", registerUser);

// ✅ login route (ADD THIS)
router.post("/login", loginUser);

module.exports = router;