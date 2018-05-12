const _ = require('lodash');
const cases = require('./cases');

module.exports = (config) => {
  const options = {
    name: '这是一个初始化测试',
    urlRoot: `http://127.0.0.1:${config.service.port}`,
    hooks: {
      done: () => {
        _.delay(() => {
          console.log('Done at: %s', new Date());
          process.exit();
        }, 100);
      },
    },
    globals: {
      request: {
        timeout: 50 * 1000,
        headers: {
          'X-Real-IP': '199.199.199.199',
        },
      },
    },
    cases,
  };

  return options;
};
