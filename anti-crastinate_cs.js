// by default, chrome injects content scripts after DOM is complete

// visit site
  // get the url and the time
    // compare time to last visit for this site
      // if it is not passed time limit, do not permit access
      // it it is passed time limit, register current time as last visit

var currentUrl = document.location.host;
var currentTime = Date.parse(new Date());

function blockSites() {
  switch(currentUrl) {
    case "www.facebook.com":
      chrome.storage.sync.get('lastFacebookVisit', function(info) {

        var oldTime, difference;

        if (info.lastFacebookVisit) {
          oldTime = info.lastFacebookVisit;
          difference = ((currentTime - oldTime) / 1000) / 60;

          if (difference > 20 && difference <= 180) {
            var fbTimeRemaining = 180 - difference;
            chrome.storage.sync.set({ 'fbTimeRemaining': fbTimeRemaining });
            // fix redirect (look up programmatic injection?)
            window.location.href = 'http://google.com';
          } else if (difference > 180) {
            chrome.storage.sync.set({ 'lastFacebookVisit': currentTime });
          }
          
        } else {
          chrome.storage.sync.set({ 'lastFacebookVisit': currentTime });
        }
      });
      break;
    case "twitter.com":
      chrome.storage.sync.get('lastTwitterVisit', function(info) {
        var oldTime, difference;

        if (info.lastTwitterVisit) {
          oldTime = info.lastTwitterVisit;
          difference = ((currentTime - oldTime) / 1000) / 60;

          if (difference > 20 && difference <= 180) {
            var twTimeRemaining = 180 - difference;
            chrome.storage.sync.set({ 'twTimeRemaining': twTimeRemaining });
            window.location.href = 'http://google.com';
          } else if (difference > 180) {
            chrome.storage.sync.set({ 'lastTwitterVisit': currentTime });
          }
          
        } else {
          chrome.storage.sync.set({ 'lastTwitterVisit': currentTime });
        }
      });
      break;
  }
}

// when no message from popup, run check and blockSites()
chrome.storage.sync.get('active', function(data) {
  console.log("initial check");
  console.log("data.active:", data.active);
  if (data.active === true || data.active === undefined) {
    blockSites();
  }
});

// when button is clicked in popup, listen for message sent.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("popup opened");
  console.log("request.active:", request.active);
  if (request.active == true) {
    blockSites();
  }
});