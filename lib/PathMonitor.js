
var D = require('JQDeferred');
var fbutil = require('./fbutil');

function PathMonitor(ejs, firebaseUrl, path) {
   this.ref = fbutil.fbRef(firebaseUrl, path.path);
   console.log('Indexing %s/%s using path "%s"'.grey, path.index, path.type, fbutil.pathName(this.ref));
   this.ejs = ejs;

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
      this.ejs.Document(this.index, this.type, key).source(data).doIndex(function() {
         console.log('indexed'.green, name);
      }, function(err) {
         console.error('failed to index %s: %s'.red, name, err);
      });
   },

   _childChanged: function(key, data) {
      console.log('updated'.cyan, nameFor(this, key));
      //todo
      //todo
      //todo
   },

   _childRemoved: function(key, data) {
      console.log('deleted'.cyan, nameFor(this, key));
      //todo
      //todo
      //todo
   }
};

function nameFor(path, key) {
   return path.index + '/' + path.type + '/' + key;
}

exports.process = function(ejs, firebaseUrl, paths) {
   paths && paths.forEach(function(pathProps) {
      new PathMonitor(ejs, firebaseUrl, pathProps);
   });
};