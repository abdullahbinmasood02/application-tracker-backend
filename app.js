const express = require("express");
const app = express();
const applicationRouter = require("./routes/applicationRoutes");
const globalErrorController = require("./controllers/errorController");
const AppError = require("./utils/AppError");

app.use(express.json());
app.use("/api/v1/applications", applicationRouter);
// app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`route ${req.originalUrl} not found on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;
