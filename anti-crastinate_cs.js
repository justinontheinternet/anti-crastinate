// by default, chrome injects content scripts after DOM is complete

// visit site
  // get the url and the time
    // compare time to last visit for this site
      // if it is not passed time limit, do not permit access
      // it it is passed time limit, register current time as last visit

var currentUrl = document.location.host;
var currentTime = Date.parse(new Date());
var storage = chrome.storage.sync;
var obj = {};
var exploreLimit, blockLimit, lastSiteVisit;

// NOT CURRENTLY IMPLEMENTED. attempting to make blockSites more DRY. Issues with chrome.storage recognizing dynamic key names.
function determineAccess(obj) {

  console.log("lastSiteVisit:", lastSiteVisit);

  storage.get(lastSiteVisit, function(info) {
    var oldTime, difference;

    if (typeof(info[lastSiteVisit]) === 'number') {
      oldTime = info[lastSiteVisit];

      difference = ((currentTime - oldTime) / 1000) / 60;
      console.log("oldTime:", oldTime);
      if (exploreLimit - difference < 5 && exploreLimit - difference > 0) {
        console.log("sending notification");
        chrome.runtime.sendMessage( { notify: true });
      }

      if (difference > exploreLimit && difference <= blockLimit) {
        console.log("restricting access");
        // var fbTimeRemaining = blockLimit - difference;
        // storage.set({ 'fbTimeRemaining': fbTimeRemaining });
        chrome.runtime.sendMessage({ redirect: true });
      } else if (difference > blockLimit) {
        console.log("allow visit. key is:", key);
        storage.set(obj);
      }
      
    } else {
      console.log("first visit. lastSiteVisit is:", lastSiteVisit, "currentTime:", currentTime, "obj:", obj, "info:", info);
      // SAVE WHOLE OBJECT AND THEN SET
        // lastSiteVisit = 'lastFacebookVisit';
        // obj[lastSiteVisit] = currentTime;
      storage.set(obj);
    }
  });
}


// setting key for each site on block list
function blockSites() {
  switch(currentUrl) {
    case "www.facebook.com":
    // Commented out section for use with determineAccess function above
      lastSiteVisit = 'lastFacebookVisit';
      obj[lastSiteVisit] = currentTime

      determineAccess(obj);

      // storage.get('lastFacebookVisit', function(info) {
      //   var oldTime, difference;

      //   if (info.lastFacebookVisit) {
      //     oldTime = info.lastFacebookVisit;
      //     difference = ((currentTime - oldTime) / 1000) / 60;
          
      //     if (exploreLimit - difference < 5 && exploreLimit - difference > 0) {
      //       // send message to determine last url
      //       // het last url host
      //       // if last url host does not equal current url then send message to notify
      //       chrome.runtime.sendMessage({ notify: true });
      //     }

      //     if (difference > exploreLimit && difference <= blockLimit) {
      //       // var fbTimeRemaining = blockLimit - difference;
      //       // storage.set({ 'fbTimeRemaining': fbTimeRemaining });
      //       chrome.runtime.sendMessage({ redirect: true });
      //     } else if (difference > blockLimit) {
      //       storage.set({ 'lastFacebookVisit': currentTime });
      //     }
          
      //   } else {
      //     storage.set({ 'lastFacebookVisit': currentTime });
      //   }
      // });
      break;
    case "twitter.com":
      lastSiteVisit = 'lastTwitterVisit';
      obj[lastSiteVisit] = currentTime

      determineAccess(obj);
      // storage.get('lastTwitterVisit', function(info) {
      //   var oldTime, difference;
      //   if (info.lastTwitterVisit) {
      //     oldTime = info.lastTwitterVisit;
      //     difference = ((currentTime - oldTime) / 1000) / 60;

      //     if (exploreLimit - difference < 5 && exploreLimit - difference > 0) {
      //       chrome.runtime.sendMessage({ notify: true });
      //     }

      //     if (difference > exploreLimit && difference <= blockLimit) {
      //       // var twTimeRemaining = blockLimit - difference;
      //       // storage.set({ 'twTimeRemaining': twTimeRemaining });
      //       chrome.runtime.sendMessage({ redirect: true });
      //     } else if (difference > blockLimit) {
      //       storage.set({ 'lastTwitterVisit': currentTime });
      //     }
          
      //   } else {
      //     storage.set({ 'lastTwitterVisit': currentTime });
      //   }
      // });
      break;
  }
}

// get time limit values
storage.get(['exploreLimit', 'blockLimit'], function(data) {
  if (!data.exploreLimit) {
    exploreLimit = 20;
    storage.set({'exploreLimit': '20'});
  } else {
    exploreLimit = parseInt(data.exploreLimit);
  }

  if (!data.blockLimit) {
    blockLimit = 180;
    storage.set({'blockLimit': '180'});
  } else {
    blockLimit = parseInt(data.blockLimit);
  }
});

// when no message from popup, run check and blockSites()
storage.get('active', function(data) {
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