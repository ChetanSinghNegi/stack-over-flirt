const express = require("express");
const { authChecker, checkUserAuth } = require("./middleware/auth");
const port = 3001;
const app = express();

app.use("/admin", authChecker);

app.get("/admin/get-data", (req, res, next) => {
  res.send("Please have admin's data");
});
app.get("/users", checkUserAuth, (req, res) => {
  res.send("Please have user's data");
});
app.get("/error-path", (req, res, next) => {
  try {
    throw new Error("Oh! Error Occured 1");
  } catch (err) {
    console.log("ERROR OCCURED");
    res.status(500).send("Something Went Wrong!. Please Contact Support Team.");
  }
});
app.use("/", (err, req, res, next) => {
  res.status(500).send("Something Went Wrong!. Please Contact Support Team.");
});
app.listen(port, () => {
  console.log(`Server is Listening at Port ${port}`);
});
