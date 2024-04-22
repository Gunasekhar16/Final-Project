module.exports = function (req, res, next) {
  if (!req.session.token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};
