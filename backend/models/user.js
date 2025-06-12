const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: { type: String },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  skills: { type: Array, required: true },
  photoURL: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png",
  },
  about: {
    type: String,
    default: "Hey! I recently joined the platform SyncForge",
  },
});

module.exports = {
  User: mongoose.model("User", userSchema),
};
