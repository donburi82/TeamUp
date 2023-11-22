const adminAuth = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role == "admin") {
      next();
    } else {
      return res
        .status(401)
        .json({ status: "fail", msg: "Authentication invalid" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: "fail", msg: "Authentication invalid" });
  }
};

module.exports = adminAuth;
