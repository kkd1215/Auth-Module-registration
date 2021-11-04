const HTTPStatus = require('http-status');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const randomstring = require('randomstring');

const { model: AppUserModel } = require('../../app-user');
const { model: AccessTokenModel } = require('../../access-token');
const APIError = require('../../../lib/api-error');
const logger = require('../../../lib/logger');
const CONFIG = require('../../../config');

const createLoginToken = async userData => {
  const token = jwt.sign(userData, CONFIG.jwtSecret, { expiresIn: '1d' });
  const tokenData = {
    userId: userData.id.toString(),
    token,
    expiry: moment().add(24, 'hours').toISOString(),
  };
  try {
    const loginToken = await AccessTokenModel.create(tokenData);
    return loginToken;
  } catch (exec) {
    logger.error('EXEC > CREATE_LOGIN_TOKEN > ', exec);
    throw exec;
  }
};

const login = async (req, res, next) => {
  try {
    const { body } = req;
    const { email, password } = body;

    let userInstance = await AppUserModel.findOne({
      email,
      deletedAt: null,
    }, '+password +refreshToken');

    if (!userInstance) {
      const err = new APIError('Invalid Credentials.', HTTPStatus.UNAUTHORIZED);
      return next(err);
    }

    if (userInstance.password !== password) {
      const err = new APIError('Invalid Credentials.', HTTPStatus.UNAUTHORIZED);
      return next(err);
    }

    if (userInstance.isDisabled) {
      const err = new APIError('Your account has been disabled! Pleasae contact admin support.', HTTPStatus.FORBIDDEN);
      return next(err);
    }

    let refreshToken;
    if (!userInstance.refreshToken) {
      refreshToken = randomstring.generate({ length: 64 });
      userInstance.refreshToken = refreshToken;
    } else {
      refreshToken = userInstance.refreshToken;
    }

    userInstance.lastLogin = moment().toISOString();
    userInstance = await userInstance.save();

    const userData = _.pick(userInstance, ['id']);
    userData.createdAt = moment().toISOString();

    const loginToken = await createLoginToken(userData);

    const resp = {
      loginToken: loginToken.token,
      refreshToken,
      user: userInstance.safeModel(['deletedAt', 'refreshToken']),
    };

    return res.status(HTTPStatus.OK).json(resp);
  } catch (exec) {
    logger.error('ERROR > AUTH_LOGIN > ', exec);
    return next(exec);
  }
};

module.exports = login;