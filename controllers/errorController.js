const AppError = require("../utils/AppError");

function sendCastErrorDb(error) {
  const message = `invalid value ${error.value} for the path ${error.path}`;
  const statusCode = 404;
  console.log("hello");
  return new AppError(message, statusCode);
}

function sendDupFieldsError(error) {
  const message = `duplicate value: ${Object.values(error.errorResponse.keyValue)[0]}`;
  const code = 400;
  return new AppError(message, code);
}

function sendValErrorDb(err) {
  console.log(Object.values(err.errors));
  const message = Object.values(err.errors)
    .map((error) => error.message)
    .join(" ");
  return new AppError(message, 401);
}

function sendErrorDev(error, res) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
}

function sendErrorProd(error, res) {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error("ERROR");
    res.status(error.statusCode).json({
      status: error.status,
      message: "Something went very wrong!",
    });
  }
}

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "error";
  let error;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") error = sendCastErrorDb(err);
    else if (err?.errorResponse?.code === 11000) {
      error = sendDupFieldsError(err);
    } else if (err.name === "ValidationError") error = sendValErrorDb(err);

    sendErrorProd(error, res);
  }
};
