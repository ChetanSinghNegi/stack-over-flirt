const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new Error("Invalid Token!");
  const decodedToken = jwt.verify(token, "TopSecret@123");
  const user = await User.findById(decodedToken.id);
  if (!user) throw new Error("User Not Found!");
  req.user = user;
  next();
};

module.exports = { userAuth };
