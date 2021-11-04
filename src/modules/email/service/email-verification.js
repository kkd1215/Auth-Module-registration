const _ = require('lodash');

const Sendgrid = require('../../../lib/sendgrid');
const logger = require('../../../lib/logger');
const CONFIG = require('../../../config');

const subject = 'Email Verification';

async function emailVerification(inputData) {
  try {
    const { data } = inputData;

    const URL = `${CONFIG.appUrl}/auth/confirm?uid=${_.get(data, 'user.id')}&token=${_.get(data, 'user.verificationToken')}`;
    const content = `Verification URL: ${URL}`;

    const emailData = {
      to: _.get(data, 'user.email'),
      subject,
      content,
    };

    await Sendgrid.sendEmail(emailData);
  } catch (exec) {
    logger.error('ERROR > EMAIL_VERIFICATION > ', exec);
  }
}

module.exports = emailVerification;