const controller = require('./controller');
const routes = require('./routes');
const model = require('./model');

const AppUser = {
  controller,
  routes,
  model,
};

module.exports = AppUser;