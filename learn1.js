/**
 * lean1: 简单启动
 */

 // 引入 restify
 const restify = require('restify');

 // 响应函数, 后面接着 next()
 const respond = (req, res, next) => {
   res.send(`hello, ${req.params.name}`);
   next();
 }

 // 创建 restify 服务器;
 const server = restify.createServer();

 //  server.use(): 注册handler, 注册服务器控制组件，按照代码顺序执行，需要放在路由代码之前。

 // 服务器的 routes 配置
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.post('/foo',
  (req, res, next) => {
    req.someData = 'handler chain data';
    return next();
  },
  (req, res, next) => {
    res.send(req.someData);
    return next();
  },
);

// 启动 restify 服务器;
server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
