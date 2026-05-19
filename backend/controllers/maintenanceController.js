const Maintenance = require("../models/Maintenance");

// =========================
// CREATE MAINTENANCE REQUEST
// =========================
const createRequest = async (req, res) => {
  try {

    const {
      order,
      product,
      issue
    } = req.body;

    const request =
      await Maintenance.create({

        user: req.user.id,

        order,

        product,

        issue,
      });

    res.status(201).json({
      message:
        "Maintenance request created",

      request,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// =========================
// USER GET MY REQUESTS
// =========================
const getMyRequests = async (req, res) => {

  try {

    const requests =
      await Maintenance.find({

        user: req.user.id,

      })
        .populate("product")
        .populate("order");

    res.json(requests);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// =========================
// ADMIN GET ALL REQUESTS
// =========================
const getAllRequests = async (req, res) => {

  try {

    const requests =
      await Maintenance.find()

        .populate(
          "user",
          "name email"
        )

        .populate("product")

        .populate("order");

    res.json(requests);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// =========================
// UPDATE STATUS
// =========================
const updateRequestStatus =
  async (req, res) => {

    try {

      const request =
        await Maintenance.findById(
          req.params.id
        );

      if (!request) {

        return res.status(404).json({
          message:
            "Request not found",
        });
      }

      request.status =
        req.body.status;

      const updatedRequest =
        await request.save();

      res.json(updatedRequest);

    } catch (error) {

      console.log(error);

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

  createRequest,

  getMyRequests,

  getAllRequests,

  updateRequestStatus,
};