// use chrome.storage for variables to access in popup.js and here
// by default, chrome injects content scripts after DOM is complete


var currentUrl = document.location.host;
var currentTime = new Date();
var data = { date: currentTime.toString() };


switch(currentUrl) {
  case "www.facebook.com":
    chrome.storage.sync.get('lastFacebookVisit', function(info) {

      var oldTime, newTime, difference;
      console.log(info.lastFacebookVisit);

      if (info.lastFacebookVisit) {
        oldTime = Date.parse(info.lastFacebookVisit);
        newTime = Date.parse(currentTime);
        console.log("oldTime:", oldTime, "newTime:", newTime);
        difference = ((newTime - oldTime) / 1000) / 60;
        console.log("difference value:", difference);

        if (difference >= 20 && difference <= 180) {
          console.log("inside if, difference is:", difference);
          window.location.href = 'http://google.com';
        } else if (difference > 180) {
          console.log("inside else if");
          chrome.storage.sync.set({ 'lastFacebookVisit': newTime });
        }
        
      } else {
        chrome.storage.sync.set({ 'lastFacebookVisit': data.date });
      }
    });
    break;
  case "twitter.com":
    chrome.storage.sync.get('lastTwitterVisit', function(info) {
      console.log("twitterrrrrr");
    });
    break;
}

// visit site
  // get the url and the time
    // compare time to last visit for this site
      // if it is not passed time limit, do not permit access
      // it it is passed time limit, register current time as last visit