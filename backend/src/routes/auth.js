const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");

const jwt = require("jsonwebtoken");

authRouter.get("/status", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});



authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const {
      firstName,
      lastName,
      emailId,
      gender,
      password,
      age,
      skills,
      photoURL,
      about,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
      age,
      skills,
      photoURL,
      about,
    });

    await user.save();
    res.status(200).send("User has been added successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR : " + error.message);
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials !");
    }

    const isPasswordValid = await user.validatePassword(password);

    console.log(req.body);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "None",
      });

      res.status(200).send("User logged In successfullly");
    } else {
      throw new Error("Invalid credentials !");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict", // optional but recommended
    });
    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = authRouter;
