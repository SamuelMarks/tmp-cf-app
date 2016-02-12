# tmp

Simple cloudfoundry node app to show user-provided or service-broker'd service not working.

Create service with `cf cups mongo -p '{"address": "mongodb://<mongo_address>"}'`. Deploy this app with `cf push`.

Test locally with:

    VCAP_APP_PORT=28017 MONGODB_URI=mongodb://localhost npm start
