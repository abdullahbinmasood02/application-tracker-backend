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

exports.globalErrorHandler = function (err, req, res, next) {
  let error = { ...err };
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  }
};
