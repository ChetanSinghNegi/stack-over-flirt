const express = require("express");
const port = 3001;
const app = express();
app.get("/", (req, res) => {
  res.send("You are at Home-Page");
});
app.use("/use-test", (req, res) => {
  res.send("You are at use-test and using use Method");
});
app.listen(port, () => {
  console.log(`Server is Listening at Port ${port}`);
});
