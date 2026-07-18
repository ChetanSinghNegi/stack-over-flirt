const express = require("express");
const { authChecker, checkUserAuth } = require("./middleware/auth");
const ConnectDB = require("./config/database");
const User = require("./models/user");
const valideSignupData = require("./helpers/user-validation");
const bcrypt = require("bcrypt");
const port = 3001;
const app = express();

ConnectDB()
  .then((res) => {
    console.log("Database Connected!!");
    app.listen(port, () => {
      console.log(`Server is Listening at Port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error Occured");
  });

app.use(express.json());

app.get("/get-users", async (req, res) => {
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

app.get("/get-user", async (req, res) => {
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

app.post("/signup", async (req, res) => {
  try {
    valideSignupData(req.body);
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: encryptedPassword });
    await user.save();
    res.send("User Added Successfully!!");
  } catch (err) {
    res.status(400).send("Error in Creating User! " + err.message);
  }
});

app.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    }
    res.send("User LoggedIn Successfully!!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/delete-user", async (req, res) => {
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

app.patch("/patch-user/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const updateBody = req.body.update;
    const allowedSet = new Set([
      "firstName",
      "lastName",
      "about",
      "age",
      "photoUrl",
    ]);
    const isAllowed = Object.keys(updateBody).every((ele) =>
      allowedSet.has(ele),
    );
    if (!isAllowed) {
      throw new Error("Please Send Appropriate Fields");
    }
    await User.findByIdAndUpdate(
      id,
      { ...updateBody },
      { runValidators: true },
    );
    res.send("User Patched Successfully");
  } catch (err) {
    res.status(401).send("Something Went Wrong! " + err.message);
  }
});
