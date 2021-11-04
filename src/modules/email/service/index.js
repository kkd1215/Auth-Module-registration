const EventEmitter = require('events');

class MyEmitter extends EventEmitter { }
const service = new MyEmitter();

const logger = require('../../../lib/logger');

const emailVerification = require('./email-verification');
const resetPassword = require('./reset-password');

service.on('trigger', inputData => {
  switch (inputData.type) {
    case 'EMAIL_VERIFICATION':
      emailVerification(inputData);
      break;
    case 'RESET_PASSWORD':
      resetPassword(inputData);
      break;
    default:
      logger.error('INVALID_TRIGGER', inputData);
      break;
  }
});

module.exports = service;