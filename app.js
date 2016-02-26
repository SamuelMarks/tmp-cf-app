var config = new (require('config'))(),
    restify = require('restify'),
    mongoose = require('mongoose');

var Cat = mongoose.model('Cat', { name: String });

var server = restify.createServer({
  name: 'tmp-app',
  version: '0.0.2'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.pre(function(req, res, next) {
    mongoose_event_listeners(config.getMongoUrl());
    mongoose.set('debug', true);
    mongoose.connect(config.getMongoUrl(), err => {
        if (err) req.log.error(`mongoose connection to '${config.getMongoUrl()}' failed with err = ${err}`);
        console.info('Connected to Mongo')
    });
    return next();
});

function mongoose_event_listeners(uri) {
    mongoose.connection.on('connected', function() {
        console.log('Mongoose default connection opened to: ' + uri);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function(err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}

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
