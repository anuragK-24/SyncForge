const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type " + status });
    }

    const existingUser = await User.findById(toUserId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found " });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists " });
    }

    if (fromUserId === toUserId) {
      return res
        .status(400)
        .json({ message: "Connection request already exists " });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    await connectionRequest.save();
    res.status(200).send({
      message: status.toUpperCase() + " request is sent successfully !!",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
requestRouter.post(
  "/review/:status/:requestedId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestedId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }
      const loggedInUser = req.user;

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestedId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request doesn't exist !!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({ message: "connection request " + status, data });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

module.exports = requestRouter;
