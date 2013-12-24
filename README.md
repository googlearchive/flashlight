Flashlight
==========

A pluggable integration with ElasticSearch to provide contextual searches in Firebase.

This script can:
 - monitor multiple Firebase paths and index data in real time
 - communicates with client completely via Firebase (client pushes search terms to `search/request` and reads results from `search/result`)
 - clean up old, outdated requests

Getting Started
===============

 - Install and run [ElasticSearch](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup.html) or add [Bonsai service](https://addons.heroku.com/bonsai#starter) via Heroku
 - `git clone https://github.com/firebase/flashlight`
 - `npm install`
 - edit config.js (see comments)
 - `node app.js` (run the app)

Check out the recommended security rules in example/seed/security_rules.json.

Try the example page from your local web server (located in example/ folder).

Client Implementations
======================

Check out `example/example.js` folder for a client implementation. It works like this:

 - Push an object to `/search/request` which has the following keys: `index`, `type`, and `query`
 - The query object can be any valid ElasticSearch DSL structure (see More on Queries)
 - Listen on `/search/response` for the reply from the server

More on Queries
---------------

Check out [this great tutorial](http://okfnlabs.org/blog/2013/07/01/elasticsearch-query-tutorial.html) on querying ElasticSearch. And be sure to read the [ElasticSearch API Reference](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/).

Deploy to Heroku
================

 - `cd flashlight`
 - `heroku login`
 - `heroku create` (add heroku to project)
 - `heroku addons:add bonsai` (install bonsai)
 - `heroku config`  (copy bonsai url into config.js)
 - `git add conig.js` (update)
 - `git commit -m "configure bonsai"`
 - `git push heroku master` (deploy to heroku)

Support
=======

Submit questions or bugs using the [issue tracker](https://github.com/firebase/flashlight).

For Firebase-releated questions, try the [mailing list](https://groups.google.com/forum/#!forum/firebase-talk).

License
=======

[MIT LICENSE](http://firebase.mit-license.org/)
Copyright © 2013 Firebase <opensource@firebase.com>
