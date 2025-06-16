const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = await req.user;
    res.send(user).status(200);
  } catch (error) {
    console.log("ERROR :", error.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    // Update only provided fields
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    console.log("Updated user:", loggedInUser);
    res.status(200).send("Profile updated successfully");
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(400).send("Error updating profile: " + err.message);
  }
});
profileRouter.patch("/editPassword", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 8) {
      throw new Error("Invalid password. Must be at least 8 characters.");
    }

    const loggedInUser = req.user;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    loggedInUser.password = hashedPassword;

    await loggedInUser.save();
    
    res.status(200).send(loggedInUser.firstName + ", your Password updated successfully");
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).send("Error updating password: " + err.message);
  }
});
module.exports = profileRouter;
