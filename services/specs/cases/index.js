const _ = require('lodash');
const home = require('./home');
const user = require('./user');

module.exports = _.flatten([
  home,
  user,
]);
