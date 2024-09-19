const jwt = require("../utils/jwt");

exports.authMiddleware = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied!" });
  }

  try {
    const verifiedUser = jwt.verify(token);
    req.verifiedUser = verifiedUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token!" });
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (req.verifiedUser.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only!" });
  }
  next();
};
