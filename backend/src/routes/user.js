const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const SAFE_USER_DATA = [
  "firstName",
  "lastName",
  "photoURL",
  "gender",
  "about",
  "skills",
];

userRouter.get("/swipes", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequest.find({
      fromUserId: userId,
      status: "interested",
    }).populate("toUserId", [
      "firstName",
      "lastName",
      "photoURL",
      "gender",
      "about",
      "skills",
    ]);

    const swipedProfiles = requests.map((req) => req.toUserId);

    res
      .status(200)
      .json({ message: "Profiles you swiped", data: swipedProfiles });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser._id;
    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: userId,
          status: "accepted",
        },
        {
          fromUserId: userId,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.toString() === userId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.status(200).send({ message: "Found connections ", data });
  } catch (error) {
    res.status(400).send("Error : ", error.message);
  }
});

// done added
userRouter.get("/pendingRequest", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser._id;
    const requests = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoURL",
      "gender",
      "about",
      "skills",
    ]);
    console.log(requests);

    const data = requests.map((request) => request.fromUserId);

    res.status(200).send({ message: "Found requests ", data });
  } catch (error) {
    res.status(400).send("Error : ", error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    const loggedInUserId = req.user._id.toString();

    // 1. Get all connection relations
    const connections = await ConnectionRequest.find(
      {
        $or: [
          { toUserId: loggedInUserId, status: { $in: ["accepted", "ignored", "interested"] } },
          { fromUserId: loggedInUserId, status: { $in: ["accepted", "interested"] } },
        ],
      },
      { fromUserId: 1, toUserId: 1, _id: 0 }
    );

    // 2. Extract IDs to exclude
    const connectedUserIds = connections.map((conn) => {
      const fromId = conn.fromUserId.toString();
      const toId = conn.toUserId.toString();
      return fromId === loggedInUserId ? toId : fromId;
    });

    connectedUserIds.push(loggedInUserId); // exclude self

    // 3. Final feed: users not in connectedUserIds
    const users = await User.find({ _id: { $nin: connectedUserIds } })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ feed: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//done added
userRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.log("ERROR :", error);
  }
});

userRouter.get("/users", userAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
});

userRouter.delete("/delete", userAuth, async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    await User.deleteOne({ _id });
    res.status(200).send(`${user.firstName} is deleted from the platform`);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

//done added
userRouter.patch("/profileUpdate/:userId", userAuth, async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills"];
  const updates = Object.keys(data);
  const isUpdateAllowed = updates.every((key) => ALLOWED_UPDATES.includes(key));

  if (!isUpdateAllowed) {
    return res
      .status(400)
      .json({ error: "One or more fields cannot be updated." });
  }

  if (data?.skills && data.skills.length > 10) {
    return res.status(400).json({ error: "Skills cannot be more than 10." });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = userRouter;
