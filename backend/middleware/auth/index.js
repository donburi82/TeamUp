const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .json({ status: "fail", msg: "Authentication invalid" })
      .status(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    return res
      .json({ status: "fail", msg: "Authentication invalid" })
      .status(401);
  }
};

module.exports = auth;
