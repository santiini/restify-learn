const U = require('../lib/utils');
const Oauth = require('../lib/oauth');

const PRIVATEIPGUEST = Object.freeze({
  id: 0,
  name: 'Private client',
});

const GUEST = Object.freeze({
  id: 0,
  name: 'Guest',
});

const NOTAUTHORIZEDERROR = U.rest.errors.notAuth();

const initUser = (req, user, next) => {
  if (user.isDelete === 'yes') return next(NOTAUTHORIZEDERROR);
  if (user.status === 'disabled') return next(NOTAUTHORIZEDERROR);
  req.isAdmin = user.role === 'admin';
  req.user = user;
  return next();
  /*
  return user.getTeams().then((joins) => {
    req.user.joins = {};
    if (joins) {
      U._.each(joins, (x) => {
        try {
          x.queryTypes = JSON.parse(x.queryTypes);
        } catch (e) {
          x.queryTypes = [];
        }
        req.user.joins[x.id] = x;
      });
    }
    next();
  }).catch(next);
  */
};

module.exports = (allowGuestAccessPaths) => {
  const guestAllowPaths = new Set(allowGuestAccessPaths);

  return (req, res, next) => {
    const token = U.getToken(req);
    if (!token) {
      /** 游客允许访问处理逻辑 */
      if (guestAllowPaths.has(`${req.method} ${req.route.path}`)) {
        req.user = GUEST;
        return next();
      }

      /** 私有IP客户端处理逻辑 */
      if (!req.privateSwitchs) return next(NOTAUTHORIZEDERROR);
      req.user = PRIVATEIPGUEST;
      return next();
    }

    const oauth = new Oauth(req);
    return oauth.user().then((user) => {
      initUser(req, user, next);
    }).catch(next);
  };
};
