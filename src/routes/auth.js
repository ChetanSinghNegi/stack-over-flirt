const { validateSignupData } = require("../helpers/user-validation");
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req.body);
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: encryptedPassword });
    await user.save();
    res.send("User Added Successfully!!");
  } catch (err) {
    res.status(400).send("Error in Creating User! " + err.message);
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    }
    const token = user.getJWT();
    res.cookie("token", token);
    res.send("User LoggedIn Successfully!!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful!");
  } catch (e) {
    res.status(400).send("Failed to Logout User");
  }
});

module.exports = authRouter;
