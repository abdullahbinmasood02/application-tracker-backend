const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  uniName: {
    type: String,
    required: [true, "university name is required"],
    minlength: [3, "university name cannot be less than 3 characters"],
    maxlength: [50, "university name cannot be more than 50 characters"],
  },

  status: {
    type: String,
    required: [true, "status cannot be empty"],
    enum: ["in progress", "successful", "rejected"],
    default: "in progress",
  },

  createdAt: Date,
});

const applicationModel = mongoose.model("applications", applicationSchema);
module.exports = applicationModel;
