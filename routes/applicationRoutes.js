const applicationController = require("../controllers/applicationController");
const express = require("express");

const applicationRouter = express.Router();

applicationRouter
  .route("/")
  .get(applicationController.getAllApplications)
  .post(applicationController.createApplication);
applicationRouter
  .route("/:id")
  .get(applicationController.getApplication)
  .patch(applicationController.updateApplication)
  .delete(applicationController.deleteApplication);

module.exports = applicationRouter;
