Flashlight
==========

A minimal integration with ElasticSearch to provide contextual searches in Firebase.

This script can:
 - monitor multiple Firebase paths and index data in real time
 - communicates with client completely via Firebase (client pushes search terms to `search/request` and reads results from `search/result`)
 - clean up old, outdated requests

TODO: Working client demo
TODO: Blog post walkthrough

Getting Started
===============

 - `npm install`
 - Install and run [ElasticSearch](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup.html) or add [Bonsai service](https://addons.heroku.com/bonsai#starter) via Heroku
 - `edit config.js` (see config.js comments)
 - `node app.js`

Testing
=======

Use the data under test/lib/data.json to seed a Firebase for testing.

Getting Ready for Production
============================

Deploy security rules (see test/lib/security_rules.json for a sample)
