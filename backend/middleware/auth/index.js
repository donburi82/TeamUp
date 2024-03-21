const jwt = require("jsonwebtoken");
const { tokenVerify } = require("../../helpers/auth");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ status: "fail", msg: "Authentication invalid" });
  }

  const token = authHeader.split(" ")[1];

  const result = await tokenVerify(token);
  if (result.status === "fail") {
    return res.status(401).json(result);
  } else {
    req.user = { userId: result.userId, role: result.role };
    next();
  }

  // try {
  //   const payload = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = { userId: payload.userId, role: payload.role };
  //   next();
  // } catch (error) {
  //   if (error.name === "TokenExpiredError") {
  //     return res.status(401).json({ status: "fail", msg: "Token expired" });
  //   } else {
  //     return res
  //       .status(401)
  //       .json({ status: "fail", msg: "Authentication invalid" });
  //   }
  // }
};

module.exports = auth;
