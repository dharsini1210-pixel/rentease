const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const cron = require("node-cron");

const nodemailer =
  require("nodemailer");

const Order =
  require("./models/Order");

require("dotenv").config();

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());

app.use(express.json());

// =========================
// IMPORT ROUTES
// =========================
const userRoutes =
  require("./routes/userRoutes");

const productRoutes =
  require("./routes/productRoutes");

const cartRoutes =
  require("./routes/cartRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const maintenanceRoutes =
  require("./routes/maintenanceRoutes");

const paymentRoutes =
  require("./routes/paymentRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

// =========================
// EMAIL TRANSPORTER
// =========================
const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

// =========================
// CONNECT DATABASE
// =========================
console.log(
  "Connecting to DB..."
);

mongoose
  .connect(
    process.env.MONGO_URI
  )

  .then(() =>
    console.log(
      "MongoDB Connected ✅"
    )
  )

  .catch((err) =>
    console.log(err)
  );

// =========================
// TEST ROUTE
// =========================
app.get("/", (req, res) => {

  res.send(
    "Backend Running ✅"
  );
});

// =========================
// API ROUTES
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
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// =========================
// RENTAL REMINDER CRON JOB
// =========================

// EVERY DAY AT 9 AM
cron.schedule(
  "0 9 * * *",

  async () => {

    console.log(
      "⏰ Checking rental reminders..."
    );

    try {

      const orders =
        await Order.find({});

      for (const order of orders) {

        // SKIP INVALID
        if (
          !order.deliveryDate ||
          !order.customerEmail
        ) {

          continue;
        }

        // =========================
        // CALCULATE END DATE
        // =========================
        const startDate =
          new Date(
            order.deliveryDate
          );

        const endDate =
          new Date(startDate);

        endDate.setMonth(

          endDate.getMonth() +

          Number(
            order.rentalDuration || 1
          )
        );

        const today =
          new Date();

        const diffTime =
          endDate - today;

        const daysLeft =
          Math.ceil(

            diffTime /

            (1000 * 60 * 60 * 24)
          );

        // =========================
        // 5 DAY REMINDER
        // =========================
        if (
          daysLeft <= 5 &&
          daysLeft > 2 &&
          !order.reminderSent
        ) {

          await transporter.sendMail({

            from:
              process.env.EMAIL_USER,

            to:
              order.customerEmail,

            subject:
              "⚠️ RentEase Rental Expiry Reminder",

            html: `

              <h2>
                Rental Expiring Soon ⚠️
              </h2>

              <p>
                Hello ${order.customerName},
              </p>

              <p>
                Your rental will expire in
                <b>${daysLeft} days</b>.
              </p>

              <p>
                Please renew your rental
                or schedule pickup.
              </p>

              <p>
                Thank you for using RentEase ❤️
              </p>
            `,
          });

          order.reminderSent =
            true;

          await order.save();

          console.log(
            `5-day reminder sent to ${order.customerEmail}`
          );
        }

        // =========================
        // 2 DAY REMINDER
        // =========================
        if (
          daysLeft <= 2 &&
          daysLeft >= 0 &&
          !order.renewalEmailSent
        ) {

          await transporter.sendMail({

            from:
              process.env.EMAIL_USER,

            to:
              order.customerEmail,

            subject:
              "🚨 RentEase Rental Expiring in 2 Days",

            html: `

              <h2>
                Rental Expiring in 2 Days 🚨
              </h2>

              <p>
                Hello ${order.customerName},
              </p>

              <p>
                Your rental will expire in
                <b>${daysLeft} days</b>.
              </p>

              <p>
                Renew immediately to avoid
                auto pickup scheduling.
              </p>

              <p>
                Thank you for choosing RentEase ❤️
              </p>
            `,
          });

          order.renewalEmailSent =
            true;

          await order.save();

          console.log(
            `2-day reminder sent to ${order.customerEmail}`
          );
        }

        // =========================
        // AUTO EXPIRED
        // =========================
        if (daysLeft < 0) {

          order.status =
            "Expired";

          if (
            order.pickupStatus ===
            "Not Scheduled"
          ) {

            order.pickupStatus =
              "Auto Pickup Scheduled";
          }

          await order.save();

          console.log(
            `Expired Order Updated: ${order._id}`
          );
        }
      }

    } catch (error) {

      console.log(
        "CRON ERROR:",
        error
      );
    }
  }
);

// =========================
// START SERVER
// =========================
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});