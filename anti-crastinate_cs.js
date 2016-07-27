// use chrome.storage for variables to access in popup.js and here
// by default, chrome injects content scripts after DOM is complete


var currentUrl = document.location.host;
var currentTime = Date.parse(new Date());

function blockSites() {
  switch(currentUrl) {
    case "www.facebook.com":
      chrome.storage.sync.get('lastFacebookVisit', function(info) {

        var oldTime, difference;

        if (info.lastFacebookVisit) {
          console.log("in if", info.lastFacebookVisit);
          oldTime = info.lastFacebookVisit;
          console.log("oldTime:", oldTime, "currentTime:", currentTime);
          difference = ((currentTime - oldTime) / 1000) / 60;
          console.log("difference value:", difference);

          if (difference > 20 && difference <= 180) {
            console.log("inside if, difference is:", difference);
            var fbTimeRemaining = 180 - difference;
            chrome.storage.sync.set({ 'fbTimeRemaining': fbTimeRemaining });
            // fix redirect (look up programmatic injection?)
            window.location.href = 'http://google.com';
          } else if (difference > 180) {
            console.log("inside else if");
            chrome.storage.sync.set({ 'lastFacebookVisit': currentTime });
          }
          
        } else {
          console.log("inside else");
          chrome.storage.sync.set({ 'lastFacebookVisit': currentTime });
        }
      });
      break;
    case "twitter.com":
      chrome.storage.sync.get('lastTwitterVisit', function(info) {
        var oldTime, difference;

        if (info.lastTwitterVisit) {
          console.log("in if", info.lastTwitterVisit);
          oldTime = info.lastTwitterVisit;
          console.log("oldTime:", oldTime, "currentTime:", currentTime);
          difference = ((currentTime - oldTime) / 1000) / 60;
          console.log("difference value:", difference);

          if (difference > 20 && difference <= 180) {
            console.log("inside if, difference is:", difference);
            var twTimeRemaining = 180 - difference;
            chrome.storage.sync.set({ 'twTimeRemaining': twTimeRemaining });
            window.location.href = 'http://google.com';
          } else if (difference > 180) {
            console.log("inside else if");
            chrome.storage.sync.set({ 'lastTwitterVisit': currentTime });
          }
          
        } else {
          console.log("inside else");
          chrome.storage.sync.set({ 'lastTwitterVisit': currentTime });
        }
      });
      break;
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("received message", request);
  // if (request.active == true) {
  //   console.log(request);
  // }
});

// visit site
  // get the url and the time
    // compare time to last visit for this site
      // if it is not passed time limit, do not permit access
      // it it is passed time limit, register current time as last visit