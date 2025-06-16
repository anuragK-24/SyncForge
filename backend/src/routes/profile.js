const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");

profileRouter.get("/fetch", userAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users).status(200);
  } catch (error) {
    console.log("ERROR :", error.message);
  }
});
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    const user1 = await User.getJWT();
    console.log(user1.cookies);
    const { _id, firstName, lastName, age, skills, photoURL, about } = req.body;

    const patchData = { firstName, lastName, age, skills, photoURL, about };
    const user = await User.findByIdAndUpdate(_id, patchData, {
      new: true,
      runValidators: true,
    });
    res.send(user).status(200);
  } catch (error) {
    console.log("ERROR :", error.message);
  }
});

module.exports = profileRouter;
