// DECLARE VARIABLES
var facebook = "https://www.facebook.com/";
var twitter = "https://twitter.com/";

var facebookVisits, twitterVisits;


// DEFINE FUNCTIONS

function countVisits(url) {
  switch(url) {
    case facebook:
      console.log("1 for facebook");
      facebookVisits += 1;
      break;
    case twitter:
    console.log("1 for twitter");
      twitterVisits += 1;
      break;
    default:
      console.log("default");
      break;
  }
}

function getCurrentTabUrl(countVisits) {

  var tabQueryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(tabQueryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    if (url) {
      countVisits(url);
      var address = document.getElementById('address');
      var fbCount = document.getElementById('fb-count');
      var twCount = document.getElementById('tw-count');
      address.innerHTML = url;
      fbCount.innerHTML = facebookVisits.toString();
      twCount.innerHTML = twitterVisits.toString();
    }
  });
}








document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(countVisits);
});