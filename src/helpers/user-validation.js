const validator = require("validator");
const validateSignupData = (data) => {
  const { firstName, lastName, emailId, password, age, gender, photoUrl } =
    data;
  if (!firstName || !lastName)
    throw new Error("Please Enter Valid First and Last Name");
  else if (!validator.isEmail(emailId))
    throw new Error("Enter a Valid Email Id");
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password");
  }
};

const validateEditProfileData = (req) => {
  const allowedSet = new Set([
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ]);
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedSet.has(field),
  );
  return isEditAllowed;
};

module.exports = { validateSignupData, validateEditProfileData };
