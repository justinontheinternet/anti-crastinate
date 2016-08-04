// by default, chrome injects content scripts after DOM is complete

// visit site
  // get the url and the time
    // compare time to last visit for this site
      // if it is not passed time limit, do not permit access
      // it it is passed time limit, register current time as last visit

var currentUrl = document.location.host;
var currentTime = Date.parse(new Date());
var visitLimit, blockLimit;

// attempting to make blockSites more DRY
function determineAccess(key) {
  chrome.storage.sync.get(key, function(info) {
    console.log("inside determineAccess", key, info);
    var oldTime, difference;

    if (info[key]) {
      oldTime = info[key];
      difference = ((currentTime - oldTime) / 1000) / 60;
      console.log("info[key] exists:", info[key], "oldTime:", oldTime);
      if (visitLimit - difference < 5 && visitLimit - difference > 0) {
        console.log("sending notification");
        chrome.runtime.sendMessage( { notify: true });
      }

      if (difference > visitLimit && difference <= blockLimit) {
        console.log("restricting access");
        // var fbTimeRemaining = blockLimit - difference;
        // chrome.storage.sync.set({ 'fbTimeRemaining': fbTimeRemaining });
        chrome.runtime.sendMessage({ redirect: true });
      } else if (difference > blockLimit) {
        console.log("allow visit");
        chrome.storage.sync.set({ key : currentTime });
      }
      
    } else {
      console.log("first visit");
      chrome.storage.sync.set({ key : currentTime });
    }
  });
}


// setting key for each site on block list
function blockSites() {
  switch(currentUrl) {
    case "www.facebook.com":
      chrome.storage.sync.get('lastFacebookVisit', function(info) {

        var oldTime, difference;

        if (info.lastFacebookVisit) {
          oldTime = info.lastFacebookVisit;
          difference = ((currentTime - oldTime) / 1000) / 60;
          
          if (visitLimit - difference < 5 && visitLimit - difference > 0) {
            chrome.runtime.sendMessage( { notify: true });
          }

          if (difference > visitLimit && difference <= blockLimit) {
            var fbTimeRemaining = blockLimit - difference;
            chrome.storage.sync.set({ 'fbTimeRemaining': fbTimeRemaining });
            chrome.runtime.sendMessage({ redirect: true });
          } else if (difference > blockLimit) {
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

          if (visitLimit - difference < 5 && visitLimit - difference > 0) {
            chrome.runtime.sendMessage( { notify: true });
          }

          if (difference > visitLimit && difference <= blockLimit) {
            var twTimeRemaining = blockLimit - difference;
            chrome.storage.sync.set({ 'twTimeRemaining': twTimeRemaining });
            chrome.runtime.sendMessage({ redirect: true });
          } else if (difference > blockLimit) {
            chrome.storage.sync.set({ 'lastTwitterVisit': currentTime });
          }
          
        } else {
          chrome.storage.sync.set({ 'lastTwitterVisit': currentTime });
        }
      });
      break;
  }
}

// get time limit values
chrome.storage.sync.get(['visitLimit', 'blockLimit'], function(data) {
  if (!data.visitLimit) {
    visitLimit = 20;
    chrome.storage.sync.set({'visitLimit': '20'});
  } else {
    visitLimit = parseInt(data.visitLimit);
  }

  if (!data.blockLimit) {
    blockLimit = 180;
    chrome.storage.sync.set({'blockLimit': '180'});
  } else {
    blockLimit = parseInt(data.blockLimit);
  }
});

// when no message from popup, run check and blockSites()
chrome.storage.sync.get('active', function(data) {
  if (data.active === true || data.active === undefined) {
    blockSites();
  }
});

// when button is clicked in popup, listen for message sent.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.active == true) {
    blockSites();
  }
});