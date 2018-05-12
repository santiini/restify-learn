const errors = require('./errors');
const U = require('./utils');
const config = require('../configs');

const NOTAUTHORIZEDERROR = U.rest.errors.notAuth();

const _requestGet = (url, token, options, cb) => {
  U.axios.get(url, options).then((response) => {
    cb(null, response.data);
  }).catch(cb);
};

/** open-cache 是否初始化了 */
const cacheKey = 'oauth.request.get:{0}, {1}';
const cacheLife = 3600;
const requestGet = U.cached.inited ? U.cached(cacheKey, _requestGet, cacheLife) : _requestGet;

const headers = (req, token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  'User-Agent': req.header('user-agent') || config.service.name,
  referer: req.header('referer') || '',
  'X-Real-IP': req._realIp,
  'X-Forwarded-For': req._clientIp,
});

class Oauth {
  constructor(req) {
    this.req = req;
    this.token = U.getToken(req);
    this._headers = headers(req, this.token);
  }

  /** 获取用户，根据access_token */
  user() {
    if (U.isTest) return this.mockUser();
    const options = { headers: this._headers };
    const url = this.url('/api/oauth/current');
    return new Promise((resolve, reject) => {
      requestGet(url, this.token, options, (error, data) => {
        if (error) return reject(error);
        return U.model('user').findByEmail(data.email).then((user) => {
          if (!user) return reject(NOTAUTHORIZEDERROR);
          user.oauth = data;
          return resolve(user);
        }).catch(reject);
      });
    });
  }

  /** 添加用户 */
  addUser(user) {
    const options = { headers: this._headers };
    return U.axios.post(this.url('/api/users'), user, options);
  }

  /** 模拟用户 */
  mockUser() {
    const User = U.model('user');
    return new Promise((resolve, reject) => {
      User.findById(this.token).then((user) => {
        if (!user) return reject(errors.notFound());
        user.oauth = { id: user.id, email: user.email, username: user.name };
        return resolve(user);
      }).catch(reject);
    });
  }

  url(uri) {
    return `${config.oauth.api}${uri}`;
  }

  destroyRequstMemory(token) {
    const url = this.url('/api/oauth/current');
    return requestGet.removeKey(url, token, U.noop);
  }

}

module.exports = Oauth;
