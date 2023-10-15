const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.Secrete_key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Attach user data to the request for further processing
    req.user = decoded;
    // console.log(decoded);
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the required roles
    if (!req.user || !roles.includes(req.user.userRole)) {
      return res.status(403).json({
        isError: true,
        message:
          "Permission denied. You are not authorized to access this resource.",
      });
    }
    next(); // User has the required role, continue to the next middleware/route
  };
};

module.exports = { authenticateUser, requireRole };
