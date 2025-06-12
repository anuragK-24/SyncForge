const express = require("express");
const app = express();
const user = require("../routers/user");
const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use("/api/user", user);


app.listen(5000, ()=>{
    console.log("Server started");
})