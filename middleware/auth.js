// const config = require("config");
// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   const token = req.header("x-auth-token");
//   if (!token) return     res.send({ success: false, message: "Invalid Token" })
//   try {
//     const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.send({ success: false, message: "Invalid Token" })
//   }
// };

module.exports = function (req, res, next) {
  if (!req.session.token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};
