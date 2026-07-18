const validator = require("validator");
const valideSignupData = (data) => {
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

module.exports = valideSignupData;
