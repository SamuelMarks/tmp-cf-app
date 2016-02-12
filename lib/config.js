var util = require('util');

const Config = {
  getMongoUrl: name => {
          /**
           * Retrieves the mongo connection string url from the VCAP_SERVICES
           * environment variable.  If `name` is provided then the url for a
           * service matching that name is returned, otherwise name defaults to
           * DEFAULT_MONGO_SERVICE_NAME set on environment variables
           */

          name = name || process.env['DEFAULT_MONGO_SERVICE_NAME'];

          if (process.env['MONGODB_URI']) return process.env['MONGODB_URI'];

          function die() {
            throw new TypeError(util.format('A mongo service named %j was not found in the $VCAP_SERVICES', name));
          }

          const vcapServices = process.env['VCAP_SERVICES'] && JSON.parse(process.env['VCAP_SERVICES']);

          if (!vcapServices || !vcapServices['user-provided'] && !vcapServices[process.env['DEFAULT_MONGO_SERVICE_BROKER_NAME']]) die();
          const service = (provider => provider.length? Object.freeze(provider[0]): die())((userProvided => userProvided.length? userProvided:
            vcapServices[process.env['DEFAULT_MONGO_SERVICE_BROKER_NAME']].filter(srv => srv.name === process.env['DEFAULT_MONGO_SERVICE_NAME'])
          )(vcapServices['user-provided']? vcapServices['user-provided'].filter(srv => srv.name === 'mongo'): Object.freeze({length: 0})));
          console.log('service = %j', service)
          return service.credentials.url || service.credentials.uri || service.credentials.address;
      },

getPort: () => {
          /**
           * Returns the VCAP_APP_PORT configuration parameter if available,
           * otherwise returns the 'port' config parameter
           */
          const port = process.env['VCAP_APP_PORT'] || process.env['PORT'];

          if (!port) {
              throw new TypeError('Neither $VCAP_APP_PORT nor $PORT are defined')
          }

          return port;
      }
};

var config = module.exports = Config;
