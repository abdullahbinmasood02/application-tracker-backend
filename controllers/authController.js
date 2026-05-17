const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.signup = catchAsync(async function (req, res) {
  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(
      new AppError(`please provide a valid email and/or password`, 404),
    );
  const user = await userModel.findOne({ email }).select("+password");

  if (!user || !user.isCorrectPassword(password, user.password)) {
    return next(new AppError("Email and/or password not valid"));
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = async function (req, res, next) {
  //check if token exists in header
  if (
    !req?.headers?.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(new AppError("authorization header not set"), 404);

  let token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new AppError("token not set in header"), 404);
  }
  //check if token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded) {
    return next(new AppError("User not logged in"), 401);
  }
  //check if user still exists
  const freshUser = await userModel.findById(decoded.id);
  if (!freshUser) return next(new AppError("User no longer exists", 401));
  console.log(freshUser);
  //check if password was changed recently
  if (freshUser.passwordChanged(decoded.iat * 1000))
    return next(new AppError("password was changed. Please Login again"), 401);

  req.user = freshUser;
  next();
};
