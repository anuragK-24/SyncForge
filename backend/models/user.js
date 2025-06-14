const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: { type: String },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return ["female", "male", "others"].includes(value);
        },
        message: "Entered gender is not valid!",
      },
    },
    password: { type: String, required: true },
    age: { type: Number },
    skills: { type: [String], required: true },
    photoURL: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png",
    },
    about: {
      type: String,
      default: "Hey! I recently joined the platform SyncForge",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  User: mongoose.model("User", userSchema),
};
