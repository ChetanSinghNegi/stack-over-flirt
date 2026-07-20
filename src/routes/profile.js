const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../helpers/user-validation");
const User = require("../models/user");
const express = require("express");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const updateBody = req.body.update;
    if (!validateEditProfileData(req)) {
      throw new Error("Please Send Appropriate Fields");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });
    loggedInUser.save();
    res.send("User Patched Successfully");
  } catch (err) {
    res.status(401).send("Something Went Wrong! " + err.message);
  }
});

module.exports = profileRouter;
