/**
 * lean3: server.use() 使用插件
 */

 // 引入 restify
 const restify = require('restify');
 const querystring = require('qs');

 // 创建 restify 服务器;
 const server = restify.createServer();

 server.pre(((req, res, next) => {
   console.log('req: %s', req.href());
   return next();
 }));


 //  server.use(restify.plugins.queryParser()); // 使用 restify 自带的插件，也可以使用其他的插件;
 server.use(restify.plugins.acceptParser(server.acceptable));
 server.use(restify.plugins.authorizationParser());
//  server.use(restify.plugins.queryParser()); // 解析 request.query
 server.use(restify.plugins.gzipResponse());
//  server.use(restify.plugins.bodyParser()); // 解析 request.body
 
 
 // 服务器的 routes 配置
 server.post('/plugins', (req, res, next) => {
   console.log(req.body);
   console.log(querystring);
   res.send({a: 1});
    next();
 });
 server.get('/plugins', (req, res, next) => {
   // queryParser 插件: 
   // 没有使用插件时, req.query() = "name=sun"
   // 使用插件后, "name=sun"
   console.log(req.query);
   res.send({
     get: 'message',
   });
   next();
 });


// 启动 restify 服务器;
server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});

// 错误捕捉
server.on('InternalServer', (req, res, err, cb) => {
  console.log('500');
  console.log(err);
});
server.on('restifyError', (req, res, err, cb) => {
  console.log('restify error');
  console.log(err);
});
