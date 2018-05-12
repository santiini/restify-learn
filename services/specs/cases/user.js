module.exports = [{
  name: '管理员添加一个用户',
  uri: '/users',
  verb: 'post',
  headers: {
    'X-Auth-Token': '1',
  },
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
  },
  expects: {
    Status: 201,
    JSON: {
      id: 2,
      name: 'StonePHP',
      email: '269718799@qq.com',
      status: 'enabled',
      isDelete: 'no',
      role: 'member',
    },
  },
}, {
  name: '游客无法访问注册',
  uri: '/users',
  verb: 'post',
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
  },
  expects: {
    Status: 404,
    JSON: {
      code: 'ResourceNotFound',
      message: 'Resource not found.',
    },
  },
}, {
  name: '普通用户无法访问注册',
  uri: '/users',
  verb: 'post',
  headers: {
    'X-Auth-Token': '2',
  },
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
  },
  expects: {
    Status: 404,
    JSON: {
      code: 'ResourceNotFound',
      message: 'Resource not found.',
    },
  },
}];
