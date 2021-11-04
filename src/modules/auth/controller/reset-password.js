const HTTPStatus = require('http-status');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { model: AppUserModel } = require('../../app-user');
const { model: AccessTokenModel } = require('../../access-token');
const { service: EmailService } = require('../../email');
const APIError = require('../../../lib/api-error');
const logger = require('../../../lib/logger');
const CONFIG = require('../../../config');

const createResetPasswordToken = async userData => {
  const token = jwt.sign(userData, CONFIG.jwtSecret, { expiresIn: '15m' });
  const tokenData = {
    userId: userData.id.toString(),
    token,
    expiry: moment().add(15, 'minutes').toISOString(),
  };
  try {
    const resetPasswordToken = await AccessTokenModel.create(tokenData);
    return resetPasswordToken.token;
  } catch (exec) {
    logger.error('EXEC > CREATE_RESET_PASSWORD_TOKEN > ', exec);
    throw exec;
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { body } = req;
    const { email } = body;

    const userInstance = await AppUserModel.findOne({
      email,
      deletedAt: null,
    });

    if (!userInstance) {
      const err = new APIError('User not found!', HTTPStatus.NOT_FOUND);
      return next(err);
    }

    const userData = _.pick(userInstance, ['id']);
    userData.createdAt = moment().toISOString();

    const resetPasswordToken = await createResetPasswordToken(userData);

    const dataToEmit = {
      resetPasswordToken,
      user: userInstance,
    };

    // TRIGGER EMAIL_VERIFICATION EMAIL
    EmailService.emit('trigger', {
      type: 'RESET_PASSWORD',
      data: dataToEmit,
    });

    const resp = {
      message: 'Email has been sent for resetting your password.',
    };
    return res.status(HTTPStatus.OK).json(resp);
  } catch (exec) {
    logger.error('ERROR > AUTH_RESET_PASSWORD > ', exec);
    return next(exec);
  }
};

module.exports = resetPassword;