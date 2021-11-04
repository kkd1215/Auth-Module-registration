const HTTPStatus = require('http-status');
const _ = require('lodash');

const { model: AppUserModel } = require('../../app-user');
const { service: EmailService } = require('../../email');
const APIError = require('../../../lib/api-error');
const logger = require('../../../lib/logger');

const ALLOWED_VALUES = ['firstName', 'lastName', 'email', 'password', 'refData', 'createdBy'];

const register = async (req, res, next) => {
  try {
    const { body } = req;
    const { email } = body;

    const data = _.pick(body, ALLOWED_VALUES);
    console.log({
      email,
      deletedAt: null,
    });
    const userInstance = await AppUserModel.findOne({
      email,
      deletedAt: null,
    });

    if (userInstance) {
      const err = new APIError('User with email already exists.', HTTPStatus.FORBIDDEN);
      return next(err);
    }

    const user = new AppUserModel(data);
    const createdUserInstance = await user.save();

    // TRIGGER EMAIL_VERIFICATION EMAIL
    EmailService.emit('trigger', {
      type: 'EMAIL_VERIFICATION',
      data: {
        user: createdUserInstance,
      },
    });

    return res.status(HTTPStatus.OK).json({
      message: 'Account has been created. Please check your email for verification.',
    });
  } catch (exec) {
    logger.error('ERROR > AUTH_REGISTER > ', exec);
    return next(exec);
  }
};

module.exports = register;