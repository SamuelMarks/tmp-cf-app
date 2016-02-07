var util = require('util');

var Config = {
  getMongoUrl: function (name) {
          /**
           * Retrieves the mongo connection string url from the VCAP_SERVICES
           * environment variable.  If `name` is provided then the url for a
           * service matching that name is returned, otherwise name defaults to
           * DEFAULT_MONGO_SERVICE_NAME set on environment variables
           */

          var service, vcapServices;
          name = name || process.env['DEFAULT_MONGO_SERVICE_NAME'];
          service = {credentials: {url: process.env['MONGO_URL']}};

          if (!service || !service.credentials.url) {
              function die() {
                throw new TypeError(util.format('A mongo service named %j ' +
                                    'was not found in the $VCAP_SERVICES', name));
              }

              vcapServices = process.env['VCAP_SERVICES'] && JSON.parse(process.env['VCAP_SERVICES']);

              if (!vcapServices || !vcapServices['user-provided']) die();
              service = vcapServices['user-provided'].filter(function(o) {
                  return o.name === 'mongo'
              });
              if (service && service.length) {
                  service = service[0];
                  service.credentials.url = service.credentials.address;
              }
              else die();
          }

          return service.credentials.url;
      },

getPort: function () {
          /**
           * Returns the VCAP_APP_PORT configuration parameter if available,
           * otherwise returns the 'port' config parameter
           */
          var port = process.env['VCAP_APP_PORT'] || process.env['PORT'];

          if (!port) {
              throw new TypeError('Neither $VCAP_APP_PORT nor $PORT are defined')
          }

          return port;
      }
};

var config = module.exports = Config;
