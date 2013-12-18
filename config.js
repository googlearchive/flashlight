/**
 * This config file is provided as a convenience for development. You can either
 * set the environment variables on your server or modify the values here.
 */


/** ElasticSearch Settings
 *********************************************/

// ElasticSearch server's host URL
exports.ES_HOST  = process.env.FLASHLIGHT_ES_HOST || 'localhost';

// ElasticSearch server's host port
exports.ES_PORT  = process.env.FLASHLIGHT_ES_PORT || '9200';

/** Firebase Settings
  ***************************************************/

// Your Firebase instance where we will listen and write search results
exports.FB_URL   = 'https://' + process.env.FLASHLIGHT_FB_NAME + '.firebaseio.com/';

// Either your Firebase secret or a token you create with no expiry, used to authenticate
// To Firebase and access search data.
exports.FB_TOKEN = process.env.FLASHLIGHT_FB_TOKEN || null;

// The path in your Firebase where clients will write search requests
exports.FB_REQ   = process.env.FLASHLIGHT_FB_REQ || 'search/request';

// The path in your Firebase where this app will write the results
exports.FB_RES   = process.env.FLASHLIGHT_FB_RES || 'search/response';

/** Paths to Monitor
 *
 * Each path can have these keys:
 * {string}   path:    [required] the Firebase path to be monitored, for example, `users/profiles`
 *                     would monitor https://<instance>.firebaseio.com/users/profiles
 * {string}   index:   [required] the name of the ES index to write data into
 * {string}   type:    [required] name of the ES object type this document will be stored as
 * {Array}    fields:  list of fields to be monitored (defaults to all fields)
 * {Function} filter:  if provided, only records that return true are indexed
 * {Function} parser:  if provided, the results of this function are passed to ES, rather than the raw data (fields is ignored if this is used)
 ****************************************************/

exports.paths = [
   {
      path:  "users",
      index: "firebase",
      type:  "user"
   },
   {
      path:  "messages",
      index: "firebase",
      type:  "message",
      fields: ['msg', 'name'],
      filter: function(data) { return data.name !== 'system'; }
   }
];

/** Config Options
  ***************************************************/

// When false, all searches are surrounded with wildcards, e.g. *foo*, so all searches are "contains"
// When true, then foo only matches the whole word foo, unless user types in foo* or *foo*
exports.MATCH_WORDS = !!process.env.FLASHLIGHT_WORDS;

console.log('process.env.node_env', process.env.NODE_ENV); //debug
// How often should the script remove unclaimed search results? probably just leave this alone
exports.CLEANUP_INTERVAL =
   process.env.NODE_ENV === 'production'?
      3600*1000 /* once an hour */ :
      60*1000 /* once a minute */;
