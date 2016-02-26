var config = new (require('config'))(),
    restify = require('restify'),
    mongoose = require('mongoose');

var Cat = mongoose.model('Cat', { name: String });

var server = restify.createServer({
  name: 'tmp-app',
  version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.post('/cat', function (req, res, next) {
  var kitty = new Cat({ name: 'Zildjian' });
  kitty.save(function (err) {
    err? res.send(400, JSON.stringify(err)): res.send(201, kitty.toJSON());
    return next();
  });
});

console.log('keys = %j', Object.keys(config));
console.log("config.getMongoUrl() =", config.getMongoUrl());
server.listen(config.getPort(), function () {
  mongoose.connect(config.getMongoUrl());
  console.log('%s listening at %s', server.name, server.url);
});
