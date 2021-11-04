const express = require('express');
const {
  body,
} = require('express-validator');

const middlewares = require('../../../middlewares');
const Controller = require('../controller');

const router = express.Router();

const paramValidation = {
  register: [
    body('firstName')
      .exists().withMessage('is required'),
    body('email')
      .exists().withMessage('is required')
      .isEmail()
      .withMessage('invalid email'),
    body('password')
      .exists().withMessage('is required'),
  ],
  confirm: [
    body('uid')
      .exists().withMessage('is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('invalid uid'),
    body('token')
      .exists().withMessage('is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('invalid token'),
  ],
  login: [
    body('email')
      .exists().withMessage('is required')
      .isEmail()
      .withMessage('invalid email'),
    body('password')
      .exists().withMessage('is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('invalid password'),
  ],
  resetPassword: [
    body('email')
      .exists().withMessage('is required')
      .isEmail()
      .withMessage('invalid email'),
  ],
};

/** POST /api/auth/register - Register API */
router.route('/register')
  .post(
    middlewares.validate(paramValidation.register),
    Controller.register,
  );

/** POST /api/auth/confirm - Confirm User API */
router.route('/confirm')
  .post(
    middlewares.validate(paramValidation.confirm),
    Controller.confirm,
  );

/** POST /api/auth/login - Login API */
router.route('/login')
  .post(
    middlewares.validate(paramValidation.login),
    Controller.login,
  );

/** POST /api/auth/reset-password - Reset Password API */
router.route('/reset-password')
  .post(
    middlewares.validate(paramValidation.resetPassword),
    Controller.resetPassword,
  );

/** POST /api/auth/logoff - Logoff API */
router.route('/logoff')
  .post(
    middlewares.isAuthenticated,
    Controller.logoff,
  );

router.get('/url', (req, res) => {
  res.status(200).send(`OK - ${req.baseUrl}`);
});

module.exports = router;