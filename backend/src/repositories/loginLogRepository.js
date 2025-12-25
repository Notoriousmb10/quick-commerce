const LoginLog = require("../models/Login");

const create = async (logData) => {
  return await LoginLog.create(logData);
};

module.exports = {
  create,
};
