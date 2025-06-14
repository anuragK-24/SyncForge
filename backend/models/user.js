const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid " + value);
        }
      },
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
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: { type: Number },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length <= 20;
        },
        message: "Too many skills, enter only 20 maximum",
      },
    },
    photoURL: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("The photo URL is invalid " + value);
        }
      },
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
