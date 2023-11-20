const adminAuth = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role == "admin") {
      next();
    } else {
      return res
        .json({ status: "fail", msg: "Authentication invalid" })
        .status(401);
    }
  } catch (error) {
    return res
      .json({ status: "fail", msg: "Authentication invalid" })
      .status(401);
  }
};

module.exports = adminAuth;
