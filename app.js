var config = require('./lib/config'),
    restify = require('restify'),
    mongoose = require('mongoose');

var Cat;

function init_models() {
  Cat = mongoose.model('Cat', { name: String });
}

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
    if (err) {
      res.send(400, JSON.stringify(err));
      return next();
    }
    res.send(201, kitty.toJSON());
    return next();
  });
});
console.log("config.getMongoUrl() =", config.getMongoUrl());
server.listen(config.getPort(), function () {
  mongoose.connect(config.getMongoUrl());
  init_models();
  console.log('%s listening at %s [:%s]', server.name, server.url, config.getPort());
});
