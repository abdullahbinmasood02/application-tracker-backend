const express = require("express");
const app = express();
const applicationRouter = require("./routes/applicationRoutes");

app.use(express.json());
app.use("/api/v1/applications", applicationRouter);
// app.use("/api/v1/users", userRouter);

module.exports = app;
