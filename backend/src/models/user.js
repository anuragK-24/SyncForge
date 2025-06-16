const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 15,
    },
    lastName: {
      type: String,
      maxLength: 15,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid: " + value);
        }
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
    gender: {
      type: String,
      required: true,
      lowercase: true,
      enum: {
        values: ["female", "male", "others"],
        message: "Gender must be 'female', 'male', or 'others'",
      },
    },
    photoURL: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("The photo URL is invalid: " + value);
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

// don't use arrow function here, as this keyword don't work inside it.
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isValidPassword;
};
module.exports = mongoose.model("User", userSchema);
