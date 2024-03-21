const jwt = require("jsonwebtoken");

const tokenVerify = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { status: "success", userId: payload.userId, role: payload.role };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { status: "fail", msg: "Token expired" };
    } else {
      return { status: "fail", msg: "Authentication invalid" };
    }
  }
};

module.exports = { tokenVerify };
