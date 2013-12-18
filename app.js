#!/usr/bin/env node

var ejs          = require('elastic.js'),
    nc           = require('elastic.js/elastic-node-client'),
    conf         = require('./config'),
    fbutil       = require('./lib/fbutil'),
    PathMonitor  = require('./lib/PathMonitor'),
    SearchQueue  = require('./lib/SearchQueue');

// setup client
ejs.client = nc.NodeClient(conf.ES_HOST, conf.ES_PORT);

fbutil.auth(conf.FB_URL, conf.FB_TOKEN).done(function() {
   PathMonitor.process(ejs, conf.FB_URL, conf.paths);
   SearchQueue.init(ejs, conf.FB_URL, conf.FB_REQ, conf.FB_RES, conf.MATCH_WORDS, conf.CLEANUP_INTERVAL);
});