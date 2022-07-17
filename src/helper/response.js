const response = {};

response.isSuccessHaveData = (res, status, data, msg) => {
  return res.status(status).json({
    status: "success",
    message: msg,
    data,
  });
};
response.isSuccessHavePagination = (res, status, data, meta, msg) => {
  return res.status(status).json({
    status: "success",
    message: msg,
    data,
    meta,
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
