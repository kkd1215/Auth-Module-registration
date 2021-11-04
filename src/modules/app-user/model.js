const mongoose = require('mongoose');
const randomstring = require('randomstring');
const _ = require('lodash');

const { Schema } = mongoose;
// const { roles } = require('./constants'); SETTING UP ROLES EXAMPLE

/*
 * AppUser Schema *
 */
const AppUserSchema = new Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: [true, 'Email not unique'],
    lowercase: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  // role: {
  //   type: String,
  //   enum: roles,
  //   default: 'APP_USER',
  // },
  verificationToken: {
    type: String,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  refData: {
    type: Object,
    required: false,
    default: {},
  },
  lastLoginAt: {
    type: Date,
    required: false,
  },
  // createdBy: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'AppUser',
  //   required: false,
  // },
  isDisabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  deletedAt: {
    type: Date,
    required: false,
    default: null,
  },
}, {
  timestamps: {},
  collection: 'AppUser',
  minimize: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

AppUserSchema.virtual('id').get(function () {
  return this._id.toString();
});

// AppUserSchema.virtual('creator', {
//   ref: 'AppUser', // The model to use
//   localField: 'createdBy', // Find people where `localField`
//   foreignField: '_id', // is equal to `foreignField`
//   // If `justOne` is true, 'members' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   justOne: true,
// });

// Verification Token
const generateVerificationToken = () => randomstring.generate({ length: 64 });

// Generate passwordToken
AppUserSchema.pre('save', function (next) {
  const user = this;
  if (this.isNew && !this.emailVerified) {
    user.verificationToken = generateVerificationToken();
  }
  next();
});

/**
 * Remove private/hidden properties before sending data
 * @returns {Object} - AdminUser Object without private properties.
 */
function safeModel(ignore = []) {
  return _.omit(this.toJSON({ virtuals: true }), _.concat(['password', '__v', 'verificationToken'], ignore));
}

/**
 * Methods
 */
AppUserSchema.methods = {
  safeModel,
};

/**
 * @typedef AppUserSchema
 */
const AppUser = mongoose.model('AppUser', AppUserSchema);
module.exports = AppUser;