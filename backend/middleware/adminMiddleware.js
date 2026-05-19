const admin = (req, res, next) => {

  // CHECK USER ROLE
  if (
    req.user &&
    req.user.role === "admin"
  ) {

    next();

  } else {

    res.status(401).json({
      message:
        "Admin access only",
    });
  }
};

module.exports = {
  admin,
};