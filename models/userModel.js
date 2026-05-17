const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");

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
    select: false,
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

  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

userSchema.methods.isCorrectPassword = async function (
  sentPassword,
  candidatePassword,
) {
  return await bcrypt.compare(sentPassword, candidatePassword);
};

userSchema.methods.passwordChanged = function (token_time) {
  //token time is in ms

  return parseInt(this.passwordChangedAt.getTime(), 10) > token_time;
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
