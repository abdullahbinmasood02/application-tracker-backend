const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },

  email: {
    type: String,
    required: [true, "please enter your email"],
    validate: [validator.isEmail],
  },

  password: {
    type: String,
    required: [true, "please enter your password"],
  },

  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },
      message: "passwords do not match",
    },
  },
});

userModel.pre("save", (next) => {
  if (!this.isModified("password")) next();
  const hashedPassword = bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
