const authChecker = (req, res, next) => {
  const token = "xyz";
  //   const token = "xyfdsafdsz";
  if (token == "xyz") {
    console.log("Authentication Successful");
    next();
  } else {
    res.status(401).send("Authentication Failed");
  }
};
const checkUserAuth = (req, res, next) => {
  // TODO: Add User Authentication Logic
  console.log("User Authentication Passed");
  next();
};

module.exports = { authChecker, checkUserAuth };
