const { Schema, default: mongoose } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "Firstname should be greater than equals 3 character"],
      maxLength: [50, "Firstname should be smaller than equals 50 character"],
    },
    lastName: {
      type: String,
      required: false,
      minLength: [3, "Firstname should be greater than equals 3 character"],
      maxLength: [50, "Firstname should be smaller than equals 50 character"],
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: "Not a Valid Email!",
      },
    },
    about: {
      type: String,
      default: "Dev is in search for someone here",
    },
    password: {
      type: String,
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message: "Weak Password",
      },
    },
    age: {
      type: Number,
      validate: {
        validator: (value) => {
          return value >= 18;
        },
        message: (props) => {
          return `${props.value} should be above 18!`;
        },
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    photoUrl: {
      type: String,
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid Photo URL!",
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
