const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const DB = process.env.DB.replace("<PASSWORD>", process.env.PASSWORD);
const PORT = process.env.PORT || 3000;
console.log(process.env.NODE_ENV);

process.on("unhandledRejection", (err) => {
  console.log(err.name, "\n", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.log("uncaught exception", "\n", err.name, "\n", err.message);
  process.exit(1);
});

mongoose.connect(DB).then(() => console.log("DB CONNECTION SUCCESSFUL"));

const server = app.listen(PORT, () => `server is listening at port ${PORT}`);
