
var fbutil = require('./fbutil');

function SearchQueue(ejs, reqRef, resRef, matchWholeWords, cleanupInterval) {
   this.ejs = ejs;
   this.inRef = reqRef;
   this.outRef = resRef;
   this.matchWholeWords = !!matchWholeWords;
   this.cleanupInterval = cleanupInterval;
   console.log('Queue started, IN: "%s", OUT: "%s"'.grey, fbutil.pathName(this.inRef), fbutil.pathName(this.outRef));
   setTimeout(function() {
      this.inRef.on('child_added', this._process, this);
   }.bind(this), 1000);
   this._nextInterval();
}

SearchQueue.prototype = {
   _process: function(snap) {
      var dat = snap.val();
      if( this._assertValidSearch(snap.name(), snap.val()) ) {
         var term = makeTerm(dat, dat.hasOwnProperty('words')? !!dat.words : this.matchWholeWords);
         console.log('search %s: %s/%s "%s"'.magenta, snap.name(), dat.index, dat.type, term);
         var req = this.ejs.Request();
         req.indices(dat.index);
         req.types(dat.type);
         req.query(this.ejs.QueryStringQuery(term));
         req.doSearch(this._reply.bind(this, snap.name()));
      }
   },

   _reply: function(key, results) {
      if( results.error ) {
         this._replyError(key, results.error);
      }
      else {
         console.log('result %s: %d hits'.yellow, key, results.hits.total);
         this._send(key, results.hits);
      }
   },

   _assertValidSearch: function(key, props) {
      var res = true;
      if( typeof(props) !== 'object' || typeof(props.term) !== 'string' ) {
         this._replyError(key, 'search request must be a valid object with a string string in key `term`');
      }
      return res;
   },

   _replyError: function(key, err) {
      this._send(key, { total: 0, error: err })
   },

   _send: function(key, data) {
      this.inRef.child(key).remove(this._abortOnWriteError.bind(this));
      this.outRef.child(key).setWithPriority(data, new Date().valueOf());
   },

   _abortOnWriteError: function(err) {
      if( err ) {
         console.log((err+'').red);
         throw new Error('Unable to remove queue item, probably a security error? '+err);
      }
   },

   _housekeeping: function() {
      var self = this;
      // remove all responses which are older than CHECK_INTERVAL
      this.outRef.endAt(new Date().valueOf() - self.cleanupInterval).once('value', function(snap) {
         var count = snap.numChildren();
         if( count ) {
            console.warn('housekeeping: found %d orphans (removing them now) %s'.red, count, new Date());
            snap.forEach(function(ss) { ss.ref().remove(); });
         }
         self._nextInterval();
      });
   },

   _nextInterval: function() {
      var interval = this.cleanupInterval > 60000? 'minutes' : 'seconds';
      console.log('Next cleanup in %d %s'.grey, Math.round(this.cleanupInterval/(interval==='seconds'? 1000 : 60000)), interval);
      setTimeout(this._housekeeping.bind(this), this.cleanupInterval);
   }
};

function makeTerm(data, matchWholeWords) {
   var term = (data.term || '')+'';
   if( !matchWholeWords ) {
      if( !term.match(/^\*/) ) { term = '*'+term; }
      if( !term.match(/\*$/) ) { term += '*'; }
   }
   return term;
}

exports.init = function(ejs, url, reqPath, resPath, matchWholeWords, cleanupInterval) {
   new SearchQueue(ejs, fbutil.fbRef(url, reqPath), fbutil.fbRef(url, resPath), matchWholeWords, cleanupInterval);
};