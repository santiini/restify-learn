const U = require('../../lib/utils');
const config = require('../../configs');
const Oauth = require('../../lib/oauth');

const requestToken = (options, callback) => {
  const handler = (done) => {
    U.axios(options).then((response) => {
      done(null, [response.status, response.data]);
    }).catch(done);
  };

  U.async.retry({ times: 3, interval: 1000 }, handler, callback);
};

const generate = () => (req, res, next) => {
  const postData = {
    client_id: req.params.clientId,
    grant_type: 'authorization_code',
    code: req.params.code,
  };

  const options = {
    method: 'post',
    url: `${config.oauth.api}${config.oauth.apis.tokenApi}`,
    data: postData,
  };

  requestToken(options, (err, result) => {
    if (err) {
      U.logger.error('GET TOKEN TIMEOUT', err);
      return next(err);
    }
    const [status, data] = result;
    if (status >= 400) {
      if (data) U.logger.error(`Status: ${status}`, data);
      return next(Error(`Generate token failed: ${data.message}`));
    }
    return res.send(data);
  });
};

const destroy = () => (req, res, next) => {
  const options = {
    method: 'delete',
    url: `${config.oauth.api}${config.oauth.apis.tokenApi}`,
    headers: {
      Authorization: `Bearer ${U.getToken(req)}`,
    },
  };

  requestToken(options, (err, result) => {
    if (err) {
      U.logger.error('GET TOKEN TIMEOUT', err);
      return next(err);
    }
    const [status, data] = result;
    if (status >= 400) {
      return next(Error(`Destroy token failed ${data}`));
    }
      /** 清除缓存 */
    const oauth = new Oauth(req);
    oauth.destroyRequstMemory(U.getToken(req));
    res.status(204);
    return res.end();
  });
};

module.exports = { generate, destroy };
