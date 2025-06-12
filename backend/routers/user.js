const express = require("express");
const router = express.Router();
const {User} = require("../models/user");

router.get("/", async(req, res)=>{
    
    try {
        const users = await User.find();
        res.status(200).send(users);
        
    } catch (error) {
        res.status(404).send("Something went wrong");
    }

})

router.post("/", async (req, res)=>{
    const user = new User(req.body);
    try {
        await user.save();
        res.status(200).send("User has been added successfully");
    } catch (error) {
        res.status(400);
    }

})
router.delete("/", async (req, res) => {
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

module.exports = router;
