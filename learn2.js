/**
 * lean2: 响应处理链 - server.pre, server.use, server[httpVerb]
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


 // server.pre(): 通过 restify 服务器的 pre()方法可以注册处理器到 pre 处理器链中。对所有接收的 HTTP 请求，都会预先调用该处理器链中的处理器。
 // 该处理器链的执行发生在确定路由之前，因此即便是没有路由与请求相对应，也会调用该处理器链。
 // 该处理器链适合执行日志记录、性能指标数据采集和 HTTP 请求清理等工作。
 // 典型的应用场景包括记录所有请求的信息，类似于 Apache httpd 服务器的访问日志功能，以及添加计数器来记录访问相关的性能指标。

 server.pre(((req, res, next) => {
   console.log('req: %s', req.href());
   return next();
 }));


 // server.use(): 注册handler, 注册服务器控制组件，按照代码顺序执行，需要放在路由代码之前。
 // 通过 restify 服务器的 use()方法可以注册处理器到 use 处理器链中。
 // 该处理器链在选中了一个路由来处理请求之后被调用，但是发生在实际的路由处理逻辑之前。
 // 对于所有的路由，该处理器链中的处理器都会执行。该处理器链适合执行用户认证、应用相关的请求清理和响应格式化等工作。
 // 典型的应用场景包括检查用户是否完成认证，对请求和响应的 HTTP 头进行修改等。

 server.use(restify.plugins.queryParser); // 使用 restify 自带的插件，也可以使用其他的插件;
 server.use(((req, res, next) => {
   req.headers.accept = 'application/json';
   return next();
 }));

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
server.get('/handler_chain', [
  // handlers 数组
  (req, res, next) => {
    res.header('X_Test', 'test');
    return next();
  },
  (req, res, next) => {
    if (req.query.boom) {
      return next(new Error('boom'));
    }
    res.send({
      msg: 'hanle success',
    });
    return next();
  },
]);

// 启动 restify 服务器;
server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
