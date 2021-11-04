const HTTPStatus = require('http-status');

const { model: AccessTokenModel } = require('../../access-token');
const logger = require('../../../lib/logger');

const logoff = async (req, res, next) => {
  try {
    const { accessToken } = req;

    await AccessTokenModel.deleteOne({ token: accessToken.token });

    return res.status(HTTPStatus.OK).json();
  } catch (exec) {
    logger.error('ERROR > AUTH_LOGOFF > ', exec);
    return next(exec);
  }
};

module.exports = logoff;