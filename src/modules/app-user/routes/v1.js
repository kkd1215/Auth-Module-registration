const express = require('express');
const {
  body,
} = require('express-validator');

const middlewares = require('../../../middlewares');
const Controller = require('../controller');

const router = express.Router();

const paramValidation = {
  updatePassword: [
    body('password')
      .exists().withMessage('is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('is invalid'),
    body('token')
      .exists().withMessage('is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('is invalid'),
  ],
  changePassword: [
    body('password')
      .exists().withMessage('is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('is invalid'),
    body('oldPassword')
      .exists().withMessage('is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('is invalid'),
  ],
};

/** GET /api/app-users/profile - Profile API */
router.route('/profile')
  .get(
    // middlewares.validate(paramValidation.profile),
    middlewares.isAuthenticated,
    Controller.profile,
  );

/** POST /api/app-users/update-password - Update Password API */
router.route('/update-password')
  .post(
    middlewares.validate(paramValidation.updatePassword),
    // middlewares.isAuthenticated,
    Controller.updatePassword,
  );

/** POST /api/app-users/change-password - Change Password API */
router.route('/change-password')
  .post(
    middlewares.isAuthenticated,
    middlewares.validate(paramValidation.changePassword),
    Controller.changePassword,
  );

router.get('/url', (req, res) => {
  res.status(200).send(`OK - ${req.baseUrl}`);
});

module.exports = router;