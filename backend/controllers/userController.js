const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =========================
// REGISTER USER
// =========================
const registerUser = async (req, res) => {

  try {

    console.log("🔥 REGISTER HIT");
    console.log("BODY:", req.body);

    const {
      name,
      email,
      password,
    } = req.body;

    // VALIDATION
    if (!name || !email || !password) {

      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // CHECK EXISTING USER
    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // CREATE USER
    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,
      });

    res.status(201).json({

      _id:
        user._id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      token:
        jwt.sign(

          {
            id: user._id,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }
        ),
    });

  } catch (error) {

    console.log(
      "❌ REGISTER ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// LOGIN USER
// =========================
const loginUser = async (req, res) => {

  try {

    console.log("🔥 LOGIN HIT");
    console.log("BODY:", req.body);

    const {
      email,
      password,
    } = req.body;

    // VALIDATION
    if (!email || !password) {

      return res.status(400).json({
        message:
          "Email and password required",
      });
    }

    // CHECK USER
    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res.status(400).json({
        message:
          "User not found",
      });
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid password",
      });
    }

    // SUCCESS RESPONSE
    res.json({

      _id:
        user._id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      token:
        jwt.sign(

          {
            id: user._id,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }
        ),
    });

  } catch (error) {

    console.log(
      "❌ LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// EXPORT
// =========================
module.exports = {
  registerUser,
  loginUser,
};