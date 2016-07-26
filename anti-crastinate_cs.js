// use chrome.storage for variables to access in popup.js and here
// by default, chrome injects content scripts after DOM is complete


var currentUrl = document.location.host;
var currentTime = new Date();
var data = { date: currentTime.toString() };


switch(currentUrl) {
  case "www.facebook.com":
    chrome.storage.sync.get('lastFacebookVisit', function(site) {

      var oldTime;
      if (site.lastFacebookVisit) {
        oldTime = Date.parse(site.lastFacebookVisit.date);
        var newTime = Date.parse(currentTime);
        var diff = ((newTime - oldTime) / 1000) / 60;

        if (diff > 30) {
          window.location.href = 'http://google.com';
        }
        
      } else {
        chrome.storage.sync.set({ 'lastFacebookVisit': data.date });
      }
    });
    break;
  case "twitter.com":
    chrome.storage.sync.get('lastTwitterVisit', function(site) {
      console.log("twitterrrrrr");
    });
    break;
}

// visit site
  // get the url and the time
    // compare time to last visit for this site
      // if it is not passed time limit, do not permit access
      // it it is passed time limit, register current time as last visit