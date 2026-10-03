module.exports = {
  secret: process.env.JWT_SECRET || 'supersecretkey',
  expires: '1d',
};