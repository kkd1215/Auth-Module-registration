const register = require('./register');
const confirm = require('./confirm');
const login = require('./login');
const resetPassword = require('./reset-password');
const logoff = require('./logoff');

const Controller = {
  register,
  confirm,
  login,
  resetPassword,
  logoff,
};

module.exports = Controller;