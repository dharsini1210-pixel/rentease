const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// =========================
// GENERATE TOKEN
// =========================
const generateToken = (id) => {

  return jwt.sign(

    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "30d",
    }
  );
};

// =========================
// REGISTER USER
// =========================
const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // =========================
    // CHECK USER
    // =========================
    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {

      return res
        .status(400)
        .json({
          message:
            "User already exists",
        });
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // =========================
    // CREATE USER
    // =========================
    const user =
      await User.create({

        name,

        email,

        phone,

        password:
          hashedPassword,

        role: "user",
      });

    // =========================
    // RESPONSE
    // =========================
    res.status(201).json({

      _id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      role: user.role,

      token: generateToken(
        user._id
      ),
    });

  } catch (error) {

    console.log(
      "❌ REGISTER ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// =========================
// LOGIN USER
// =========================
const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    console.log(
      "🔥 LOGIN HIT"
    );

    console.log(
      "BODY:",
      req.body
    );

    // =========================
    // FIND USER
    // =========================
    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res
        .status(401)
        .json({
          message:
            "Invalid email",
        });
    }

    // =========================
    // CHECK PASSWORD
    // =========================
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res
        .status(401)
        .json({
          message:
            "Invalid password",
        });
    }

    // =========================
    // SUCCESS LOGIN
    // =========================
    res.json({

      _id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      role: user.role,

      token: generateToken(
        user._id
      ),
    });

  } catch (error) {

    console.log(
      "❌ LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// =========================
// EXPORTS
// =========================
module.exports = {

  registerUser,

  loginUser,
};