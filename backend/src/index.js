const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");


app.use(
  cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend's URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH" ,"DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middlewares for sending reciving data in json format, and for parsing cookies.
app.use(express.json());
app.use(cookieParser());

// connection of database
require("./config/database");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

app.listen(5000, () => {
  console.log("Server started");
});
