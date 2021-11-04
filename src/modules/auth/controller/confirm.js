const HTTPStatus = require('http-status');

const { model: AppUserModel } = require('../../app-user');

const APIError = require('../../../lib/api-error');
const logger = require('../../../lib/logger');

const confirm = async (req, res, next) => {
  try {
    const { body } = req;
    const { token, uid } = body;

    let userInstance = await AppUserModel.findById(uid);

    if (!userInstance) {
      const err = new APIError('User not found!', HTTPStatus.NOT_FOUND);
      return next(err);
    }

    if (userInstance.verificationToken !== token) {
      return next(new APIError('Token is invalid', HTTPStatus.UNPROCESSABLE_ENTITY));
    }

    userInstance.verificationToken = null;
    userInstance.emailVerified = true;
    userInstance = await userInstance.save();

    const resp = {
      message: 'Your email has been verified!',
    };

    return res.status(HTTPStatus.OK).json(resp);
  } catch (exec) {
    logger.error('ERROR > AUTH_CONFIRM > ', exec);
    return next(exec);
  }
};

module.exports = confirm;