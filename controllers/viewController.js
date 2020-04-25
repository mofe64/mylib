const catchAsync = require('../utils/catchAsync');

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('auth/login');
});
