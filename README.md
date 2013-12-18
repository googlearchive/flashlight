Flashlight
==========

A minimal integration with ElasticSearch to provide contextual searches in Firebase.

This library provides two scripts, one to update Documents in ElasticSearch, and another which
answers search requests in Firebase. Both of these scripts are intended to be hosted remotely
and run via node.js.

Getting Started
===============

npm install
Install and run [ElasticSearch]() or add [Bonsai service]() to Heroku
edit config.js (see config.js comments)
node app.js

Testing
=======

Use the data under test/lib/data.json to seed a Firebase for testing.

Getting Ready for Production
============================

Deploy security rules
