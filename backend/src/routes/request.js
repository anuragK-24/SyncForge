const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("Insidee the request api");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = requestRouter;
