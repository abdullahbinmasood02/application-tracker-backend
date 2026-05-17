const applicationController = require("../controllers/applicationController");
const authController = require("../controllers/authController");

const express = require("express");

const applicationRouter = express.Router();

applicationRouter
  .route("/")
  .get(authController.protect, applicationController.getAllApplications)
  .post(applicationController.createApplication);
applicationRouter
  .route("/:id")
  .get(applicationController.getApplication)
  .patch(applicationController.updateApplication)
  .delete(applicationController.deleteApplication);

module.exports = applicationRouter;
