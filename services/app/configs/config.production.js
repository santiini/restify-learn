const config = require('./base');

const { env } = process;

/** web service 的一些信息,主要提供给 restify.createServer 使用 */
config.service.port = '9988';
config.service.ip = env.SERVICE_IP || '127.0.0.1';

/** 数据库设置 */
config.db.host = env.ORT_HOST || '127.0.0.1';
config.db.port = env.ORT_PORT || '3306';
config.db.user = env.ORT_USER || 'root';
config.db.pass = env.ORT_PASS || '';
config.db.name = env.ORT_NAME || 'open_rest_es6_boilerplate';

/** redis 设置 */
config.cache.host = '127.0.0.1';
config.cache.port = '6379';
config.cache.opts.namespace = 'ORB';

/** oauth 设置 */
config.oauth.api = 'http://account.admaster.com.cn';
config.oauth.clientId = '7abdda1e7501c0075de9';
config.oauth.clientSecret = '2102156d3eda49e87bae7d845c8af4d120bd2b44';

module.exports = config;
