const response = {};

response.isSuccessHaveData = (res, status, data, msg) => {
  return res.status(status).json({
    status: "success",
    message: msg,
    data,
  });
};
response.isSuccessNoData = (res, status, msg) => {
  return res.status(status).json({
    status: "success",
    message: msg,
  });
};

response.isError = (res, status, msg) => {
  return res.status(status).json({
    status: "error",
    message: msg,
  });
};

module.exports = response;
