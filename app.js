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

// run an HTTP server for PaaS health checks (Heroku/OpenShift/Pingdom like this)
var port    = process.env.PORT || 5000;
require('http').createServer(function (req, res) {
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write('<html><body><img src="http://i.imgur.com/kmbjB.png"><h4>Running!</h4></body></html>');
   res.end();
}).listen(port);
console.log('%s: Node server started on localhost:%d, node.js version %s', new Date(Date.now() ), port, process.version);