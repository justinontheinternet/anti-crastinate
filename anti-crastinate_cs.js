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

function determineAccess(obj) {

  storage.get(lastSiteVisit, function(info) {
    var oldTime, difference;

    if (typeof(info[lastSiteVisit]) === 'number') {

      oldTime = info[lastSiteVisit];
      difference = ((currentTime - oldTime) / 1000) / 60;

      if (exploreLimit - difference < 5 && exploreLimit - difference > 0) {
        // trigger notification if less than 5 minutes left
        chrome.runtime.sendMessage( { notify: true });
      }

      if (difference > exploreLimit && difference <= blockLimit) {
        // restricting access
          // var fbTimeRemaining = blockLimit - difference;
          // storage.set({ 'fbTimeRemaining': fbTimeRemaining });
        chrome.runtime.sendMessage({ redirect: true });
      } else if (difference > blockLimit) {
        // allow visit if time limit has passed
        storage.set(obj);
      }
    } else {
      // first visit
      storage.set(obj);
    }
  });
}


function extractDomain(url) {
  var domain;
  // if '://' occurs, split and take third item in resulting array
  if (url.indexOf("www.") > -1) {
    domain = url.split('.')[1];
    domain = domain.charAt(0).toUpperCase() + domain.slice(1);
  } else {
    domain = url.split('.')[0];
    domain = domain.charAt(0).toUpperCase() + domain.slice(1);
  }
  //find & remove port number
  domain = domain.split(':')[0];

  return domain;
};

// setting key for each site on block list
function blockSites() {
  lastSiteVisit = 'last' + extractDomain(currentUrl) + 'Visit';
  obj[lastSiteVisit] = currentTime;

  determineAccess(obj);


  // switch(currentUrl) {
  //   case "www.facebook.com":
  //     lastSiteVisit = 'lastFacebookVisit';
  //     obj[lastSiteVisit] = currentTime

  //     determineAccess(obj);
  //     break;
  //   case "twitter.com":
  //     lastSiteVisit = 'lastTwitterVisit';
  //     obj[lastSiteVisit] = currentTime

  //     determineAccess(obj);
  //     break;
  // }
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