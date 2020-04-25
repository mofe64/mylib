const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //send token via cookies
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  //get username and password
  const { username, password } = req.body;

  //check id username and password are provided
  if (!username || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //find user based on given username and password
  const user = await User.findOne({ username }).select('+ password');

  //check if user exist and if the password given matches the password in db using instance method (checkPassword)
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  //user helper function to send token
  createSendToken(user, 200, res);
});

exports.logOut = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logged Out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in, log in to gain access', 401)
    );
  }
  //verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check is user on token still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User on this token no longer exists', 401));
  }

  //granct access
  req.user = currentUser;
  res.locals = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //verify token
      //console.log(req.cookies.jwt);
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //check is user on token still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //No logged in user
      res.locals.user = currentUser;
      //console.log(res.locals);
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
