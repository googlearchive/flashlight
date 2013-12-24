#!/usr/bin/env node

var ElasticClient = require('elasticsearchclient'),
    conf          = require('./config'),
    fbutil        = require('./lib/fbutil'),
    PathMonitor   = require('./lib/PathMonitor'),
    SearchQueue   = require('./lib/SearchQueue');

// connect to ElasticSearch
var esc = new ElasticClient({
   host: conf.ES_HOST,
   port: conf.ES_PORT,
//   pathPrefix: 'optional pathPrefix',
   secure: false,
   //Optional basic HTTP Auth
   auth: conf.ES_USER? {
      username: conf.ES_USER,
      password: conf.ES_PASS
   } : null
});

fbutil.auth(conf.FB_URL, conf.FB_TOKEN).done(function() {
   PathMonitor.process(esc, conf.FB_URL, conf.paths);
   SearchQueue.init(esc, conf.FB_URL, conf.FB_REQ, conf.FB_RES, conf.MATCH_WORDS, conf.CLEANUP_INTERVAL);
});
