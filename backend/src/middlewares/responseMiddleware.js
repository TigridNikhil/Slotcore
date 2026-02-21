const responseMiddleware = (req, res, next) => {
  res.successResponse = (data, message = "Request successful") => {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  };

  res.badRequest = (error, message = "Bad Request") => {
    res.status(400).json({
      success: false,
      message,
      error,
    });
  };

  res.notFound = (error, message = "Not Found") => {
    res.status(404).json({
      success: false,
      message,
      error,
    });
  };

  res.validationError = (error, message = "Validation Error") => {
    res.status(422).json({
      success: false,
      message,
      error,
    });
  };

  res.serverError = (error, message = "Internal Server Error") => {
    res.status(500).json({
      success: false,
      message,
      error,
    });
  };

  res.forbidden = (error, message = "Forbidden") => {
    res.status(403).json({
      success: false,
      message,
      error,
    });
  };

  res.unauthorized = (error, message = "Unauthorized") => {
    res.status(401).json({
      success: false,
      message,
      error,
    });
  };

  res.tokenvalidationError = (errors = []) => {
    res.status(401).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  };

  res.tokenserverError = (message = "Internal Server Error", err = []) => {
    res.status(401).json({
      success: false,
      message,
      errors: err,
    });
  };

  next();
};

module.exports = responseMiddleware;
