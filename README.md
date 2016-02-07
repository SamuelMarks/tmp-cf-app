# tmp

Simple cloudfoundry node app to show user-provided service not working.

Create service with `cf cups mongo -p '{"address": "mongodb://<mongo_address>"}'`. Deploy this app with `cf push`.
