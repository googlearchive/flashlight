/* example.js
 *************************************/
(function ($) {
   "use strict";
   var URL = 'https://flashlight.firebaseio.com';

   // handle form submits
   $('form').on('submit', function(e) {
      e.preventDefault();
      var $form = $(this);
      var term = $form.find('[name="term"]').val();
      var words = $form.find('[name="words"]').is(':checked');
      if( term ) {
         doSearch($form.find('[name="index"]').val(), $form.find('[name="type"]').val(), words, term);
      }
      else {
         $('#results').text('');
      }
   });

   // display search results
   function doSearch(index, type, words, term) {
      var ref = new Firebase(URL+'/search');
      var key = ref.child('request').push({ index: index, term: term, type: type, words: words }).name();
//      console.log('search', key, { index: index, term: term, type: type, words: words });
      ref.child('response/'+key).on('value', showResults);
   }

   function showResults(snap) {
      if( snap.val() === null ) { return; } // wait until we get data
//      console.log('result', snap.name(), snap.val());
      snap.ref().off('value', showResults);
      snap.ref().remove();
      $('#results').text(JSON.stringify(snap.val(), null, 2));
   }

   // display raw data for reference
   new Firebase(URL).startAt(1).endAt(2).on('value', setRawData);
   function setRawData(snap) {
      $('#raw').text(JSON.stringify(snap.val(), null, 2));
   }
})(jQuery);