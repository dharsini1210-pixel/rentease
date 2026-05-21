const cors = require("cors");

require("dotenv").config();

const express = require("express");

const path = require("path");

const connectDB = require("./config/db");

// =========================
// MIDDLEWARE
// =========================
const {
  protect,
} = require(
  "./middleware/authMiddleware"
);

// =========================
// ROUTES
// =========================
const userRoutes = require(
  "./routes/userRoutes"
);

const productRoutes = require(
  "./routes/productRoutes"
);

const cartRoutes = require(
  "./routes/cartRoutes"
);

const orderRoutes = require(
  "./routes/orderRoutes"
);

const maintenanceRoutes = require(
  "./routes/maintenanceRoutes"
);

const adminRoutes = require(
  "./routes/adminRoutes"
);

const paymentRoutes = require(
  "./routes/paymentRoutes"
);

// =========================
// EXPRESS APP
// =========================
const app = express();

console.log(
  "🔥 SERVER.JS IS RUNNING"
);

// =========================
// CONNECT DATABASE
// =========================
connectDB();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());

app.use(express.json());

// =========================
// STATIC IMAGES
// =========================
app.use(

  "/images",

  express.static(

    path.join(

      __dirname,

      "../frontend/public/images"
    )
  )
);

// =========================
// REQUEST LOGGER
// =========================
app.use(

  (req, res, next) => {

    console.log(
      `➡️ ${req.method} ${req.url}`
    );

    next();
  }
);

// =========================
// HOME ROUTE
// =========================
app.get(

  "/",

  (req, res) => {

    res.send(
      "RentEase Backend Running 🚀"
    );
  }
);

// =========================
// TEST ROUTE
// =========================
app.post(

  "/test",

  (req, res) => {

    res.json({

      message:
        "TEST WORKING",

      body:
        req.body,
    });
  }
);

// =========================
// PAYMENT ROUTES
// =========================
app.use(
  "/api/payment",
  paymentRoutes
);

// =========================
// OTHER API ROUTES
// =========================
app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/maintenance",
  maintenanceRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// =========================
// PROTECTED TEST
// =========================
app.get(

  "/protected",

  protect,

  (req, res) => {

    res.json({

      message:
        "Protected route accessed",

      user:
        req.user,
    });
  }
);

// =========================
// 404 HANDLER
// =========================
app.use(

  (req, res) => {

    res.status(404).json({

      message:
        "Route not found",
    });
  }
);

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use(

  (
    err,
    req,
    res,
    next
  ) => {

    console.error(
      "❌ GLOBAL ERROR:",
      err
    );

    res.status(500).json({

      message:

        err.message ||

        "Server error",
    });
  }
);

// =========================
// START SERVER
// =========================
const PORT =

  process.env.PORT ||

  ;

app.listen(

  PORT,

  () => {

    console.log(

      `🚀 Server running on port ${PORT}`
    );
  }
);