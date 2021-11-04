const HTTPStatus = require('http-status');

const AppUserModel = require('../model');

const APIError = require('../../../lib/api-error');
const logger = require('../../../lib/logger');

const changePassword = async (req, res, next) => {
  try {
    const { body, user } = req;
    const { oldPassword, password } = body;

    const userInstance = await AppUserModel.findById(user.id).select('+password');

    if (!userInstance) {
      const err = new APIError('User not found!', HTTPStatus.NOT_FOUND);
      return next(err);
    }

    if (userInstance.isDisabled) {
      const err = new APIError('Your account has been disabled! Pleasae contact admin support.', HTTPStatus.FORBIDDEN);
      return next(err);
    }

    if (userInstance.password !== oldPassword) {
      const err = new APIError('Current password is invalid!', HTTPStatus.FORBIDDEN);
      return next(err);
    }

    userInstance.password = password;
    await userInstance.save();

    const resp = {
      message: 'Your password has been successfully updated!',
    };

    return res.status(HTTPStatus.OK).json(resp);
  } catch (exec) {
    logger.error('ERROR > USER_CHANGE_PASSWORD > ', exec);
    return next(exec);
  }
};

module.exports = changePassword;