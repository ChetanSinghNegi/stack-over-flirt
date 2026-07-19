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

profileRouter.get("/get-users", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmailId });
    if (users.length === 0) {
      res.status(401).send("User(s) Not Found!");
    } else {
      res.send(users);
    }
  } catch (e) {
    res.status(400).send("Something Went Wrong!" + err.message);
  }
});

profileRouter.get("/get-user", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmailId });
    if (user.length === 0) {
      res.status(401).send("User Not Found!");
    } else {
      res.send(user);
    }
  } catch (e) {
    res.status(400).send("Something Went Wrong!" + err.message);
  }
});

profileRouter.delete("/delete-user", async (req, res) => {
  try {
    const id = req.body.id;
    await User.findOneAndDelete({ _id: id });
    // const userEmailId = req.body.emailId;
    // await User.findOneAndDelete({ id: userEmailId });
    res.send("User Deleted Successfully");
  } catch (e) {
    res.status(401).send("Something Went Wrong! " + err.message);
  }
});

module.exports = profileRouter;
