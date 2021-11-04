const HTTPStatus = require('http-status');
const moment = require('moment');

const AppUserModel = require('../model');
const { model: AccessTokenModel } = require('../../access-token');

const APIError = require('../../../lib/api-error');
const logger = require('../../../lib/logger');

const updatePassword = async (req, res, next) => {
  try {
    const { body } = req;
    const { token, password } = body;

    const filter = {
      token,
    };
    const accessToken = await AccessTokenModel.findOne(filter).populate('user');

    if (!accessToken) {
      return next(new APIError('Your link has expired!', HTTPStatus.NOT_FOUND));
    }
    if (moment(accessToken.expiry).isBefore(moment())) {
      return next(new APIError('Your link has expired!', HTTPStatus.UNAUTHORIZED));
    }

    const userInstance = await AppUserModel.findById(accessToken.userId);

    if (!userInstance) {
      const err = new APIError('User not found!', HTTPStatus.NOT_FOUND);
      return next(err);
    }

    if (userInstance.isDisabled) {
      const err = new APIError('Your account has been disabled! Pleasae contact admin support.', HTTPStatus.FORBIDDEN);
      return next(err);
    }

    await accessToken.remove();

    userInstance.password = password;
    await userInstance.save();

    const resp = {
      message: 'Password updated successfully!',
    };

    return res.status(HTTPStatus.OK).json(resp);
  } catch (exec) {
    logger.error('ERROR > USER_UPDATE_PASSWORD > ', exec);
    return next(exec);
  }
};

module.exports = updatePassword;