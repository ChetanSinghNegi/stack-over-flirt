const express = require("express");
const ConnectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

const port = 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);

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
