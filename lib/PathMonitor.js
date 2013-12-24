
var D = require('JQDeferred');
var fbutil = require('./fbutil');

function PathMonitor(esc, firebaseUrl, path) {
   this.ref = fbutil.fbRef(firebaseUrl, path.path);
   console.log('Indexing %s/%s using path "%s"'.grey, path.index, path.type, fbutil.pathName(this.ref));
   this.esc = esc;

   this.index = path.index;
   this.type  = path.type;
   this.filter = path.filter || function() { return true; };
   this.parse  = path.parse || function(data) { return data; };

   this._init();
}

PathMonitor.prototype = {
   _init: function() {
      this.ref.on('child_added', this._process.bind(this, this._childAdded));
      this.ref.on('child_changed', this._process.bind(this, this._childChanged));
      this.ref.on('child_removed', this._process.bind(this, this._childRemoved));
   },

   _process: function(fn, snap) {
      var dat = snap.val();
      if( this.filter(dat) ) {
         fn.call(this, snap.name(), this.parse(dat));
      }
   },

   _childAdded: function(key, data) {
      var name = nameFor(this, key);
      this.esc.index(this.index, this.type, data, key)
         .on('data', function(data) {
            console.log('indexed'.green, name);
         })
         .on('error', function(err) {
            console.error('failed to index %s: %s'.red, name, err);
         })
         .exec();
   },

   _childChanged: function(key, data) {
      var name = nameFor(this, key);
      this.esc.index(this.index, this.type, data, key)
         .on('data', function(data) {
            console.log('updated'.cyan, name);
         })
         .on('error', function(err) {
            console.error('failed to update %s: %s'.red, name, err);
         })
         .exec();
   },

   _childRemoved: function(key, data) {
      var name = nameFor(this, key);
      this.esc.deleteDocument(this.index, this.type, key, function(error, data) {
         if( error ) {
            console.error('failed to delete %s: %s'.red, name, error);
         }
         else {
            console.log('deleted'.cyan, name);
         }
      })
   }
};

function nameFor(path, key) {
   return path.index + '/' + path.type + '/' + key;
}

exports.process = function(esc, firebaseUrl, paths) {
   paths && paths.forEach(function(pathProps) {
      new PathMonitor(esc, firebaseUrl, pathProps);
   });
};