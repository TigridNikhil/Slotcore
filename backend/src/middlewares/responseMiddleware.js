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

  /**
   * Stripe-style API Response
   * @param {Object|Array} data
   * @param {string} objectType e.g. 'booking', 'service'
   */
  res.apiResponse = (data, objectType = "list") => {
    if (Array.isArray(data)) {
      return res.status(200).json({
        object: "list",
        url: req.originalUrl,
        has_more: false, // Could be enhanced with pagination logic
        data: data.map((item) => {
          const plainItem = item.toJSON ? item.toJSON() : item;
          return { ...plainItem, object: objectType };
        }),
      });
    } else {
      const plainItem = data && data.toJSON ? data.toJSON() : data;
      return res.status(200).json({
        ...plainItem,
        object: objectType,
      });
    }
  };

  next();
};

module.exports = responseMiddleware;
