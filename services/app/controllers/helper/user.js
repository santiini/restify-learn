const U = require('../../lib/utils');
const Oauth = require('../../lib/oauth');
const config = require('../../configs');
const errors = require('../../lib/errors');

/** 读取session */
const session = (statusCode = 200) => (req, res, next) => {
  const user = req.user.toJSON ? req.user.toJSON() : req.user;
  if (req.user.joins) user.joins = req.user.joins;
  if (req.user.oauth) user.oauth = req.user.oauth;

  res.send(statusCode, user);
  next();
};

/** 查找用户或者创建用户 */
const findOrCreate = (hook, emailKey = 'email', nameKey = 'name') => {
  const User = U.model('user');
  return (req, res, next) => {
    const email = req.params[emailKey];
    let name = req.params[nameKey];
    if (!name) name = email.split('@')[0];
    User.findOne({ where: { email } }).then((_user) => {
      if (_user) {
        req.hooks[hook] = _user;
        return next();
      }
      const user = User.build({ email, name, role: 'member' });
      return user.save().then((model) => {
        req.hooks[hook] = model;
        next();
      }).catch(next);
    }).catch(next);
  };
};

const addOpen = (_user = 'user', key = 'email') => (req, res, next) => {
  if (U.isTest) return next();

  const oauth = new Oauth(req);
  const user = req.hooks[_user] || req.params;
  const openUser = {
    client_id: config.oauth.clientId,
    username: '',
    email: user[key],
  };

  return oauth.addUser(openUser).then((response) => {
    if (response.status === 201) {
      res.header('X-Content-Open-User', 'added');
    }
    next();
    return response;
  }).catch((error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 422) {
        const exists = U._.some(data.errors, err => {
          const existed = err.field === 'email' && err.code === 'exists';
          return existed;
        });
        if (exists) {
          res.header('X-Content-Open-User', 'exists');
          return next();
        }
      }
    }
    return next(error);
  });
};

const genRandStr = (error = errors.notFound()) => (
  async (req, res, next) => {
    if (req.user.id === 0) return next(error);
    const randStr = await req.user.genRandStr(12);
    req.user.randStr = randStr;
    return next();
  }
);

module.exports = { session, findOrCreate, addOpen, genRandStr };
