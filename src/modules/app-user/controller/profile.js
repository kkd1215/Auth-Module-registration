const HTTPStatus = require('http-status');

const AppUserModel = require('../model');

const APIError = require('../../../lib/api-error');
const logger = require('../../../lib/logger');

const profile = async (req, res, next) => {
  try {
    const { user } = req;

    const userInstance = await AppUserModel.findById(user.id);

    if (!userInstance) {
      const err = new APIError('User not found!', HTTPStatus.NOT_FOUND);
      return next(err);
    }

    if (userInstance.isDisabled) {
      const err = new APIError('Your account has been disabled! Pleasae contact admin support.', HTTPStatus.FORBIDDEN);
      return next(err);
    }

    const resp = {
      user: userInstance.safeModel(['deletedAt', 'refreshToken']),
    };

    return res.status(HTTPStatus.OK).json(resp);
  } catch (exec) {
    logger.error('ERROR > USER_PROFILE > ', exec);
    return next(exec);
  }
};

module.exports = profile;