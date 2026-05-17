const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await userModel.find();
  res.status(200).json({
    status: "success",
    data: {
      allUsers,
    },
  });
});
