var key = ;

chrome.storage.sync.get(key, function(info) {

  var oldTime, difference;

  if (info[key]) {
    oldTime = info[key];
    difference = ((currentTime - oldTime) / 1000) / 60;
    
    if (visitLimit - difference < 5 && visitLimit - difference > 0) {
      chrome.runtime.sendMessage( { notify: true });
    }

    if (difference > visitLimit && difference <= blockLimit) {
      // var fbTimeRemaining = blockLimit - difference;
      // chrome.storage.sync.set({ 'fbTimeRemaining': fbTimeRemaining });
      chrome.runtime.sendMessage({ redirect: true });
    } else if (difference > blockLimit) {
      chrome.storage.sync.set({ key : currentTime });
    }
    
  } else {
    chrome.storage.sync.set({ key : currentTime });
  }
});