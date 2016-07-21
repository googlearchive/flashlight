'use strict';

var Firebase = require('firebase');
require('colors');

exports.init = function(databaseURL, serviceAccount) {
   console.log('Connecting to Firebase %s'.grey, databaseURL);
   var config = {
     databaseURL: databaseURL,
     serviceAccount: serviceAccount
   };
   Firebase.initializeApp(config)
};

exports.fbRef = function(path) {
   return Firebase.database().ref().child(path);
};

exports.pathName = function(ref) {
   var p = ref.parent.key;
   return (p? p+'/' : '')+ref.key;
};
