const _ = require('lodash');

const Sendgrid = require('../../../lib/sendgrid');
const logger = require('../../../lib/logger');
const CONFIG = require('../../../config');

const subject = 'Reset Password';

async function resetPassword(inputData) {
  try {
    const { data } = inputData;

    const URL = `${CONFIG.appUrl}/auth/update-password?token=${_.get(data, 'resetPasswordToken')}`;
    const content = `Reset Password URL: ${URL}`;

    const emailData = {
      to: _.get(data, 'user.email'),
      subject,
      content,
    };

    await Sendgrid.sendEmail(emailData);
  } catch (exec) {
    logger.error('ERROR > RESET_PASSWORD > ', exec);
  }
}

module.exports = resetPassword;