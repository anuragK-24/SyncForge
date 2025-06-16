const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const user = require("./routes/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

// middlewares for sending reciving data in json format, and for parsing cookies.
app.use(express.json());
app.use(cookieParser());

// connection of database
require("./config/database");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);


app.use("/api/user", user);

app.listen(5000, () => {
  console.log("Server started");
});
