function sendStatus(status) {  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { active: status });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('toggle-switch');
  var turnOn = "Turn on";
  var turnOff = "Turn off";
  var status;
    
  // find out whether the extension is active
  chrome.storage.sync.get('active', function(data) {    
    // if there is no value, set it to active
    if (data.active === undefined) {      
      status = true;
      chrome.storage.sync.set({ 'active': status });
      button.innerHTML = turnOff;
      // sendStatus(status);
    } else if (data.active === true) {      
      button.innerHTML = turnOff;
    } else {      
      status === false;
      button.innerHTML = turnOn;
    }
  });

  button.addEventListener('click', function() {    
    if (button.innerHTML === turnOff) {      
      status = false;
      chrome.storage.sync.set({ 'active': status });
      sendStatus(status);
      button.innerHTML = turnOn;
    } else {      
      status = true;
      chrome.storage.sync.set({ 'active': status });
      sendStatus(status);
      button.innerHTML = turnOff;
    }
  });
});











// // DEFINE FUNCTIONS

// function getCurrentTabUrl(countVisits) {

//   var tabQueryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query(tabQueryInfo, function(tabs) {
//     var tab = tabs[0];
//     var url = tab.url;

//     if (url) {
//       countVisits(url);
//       var address = document.getElementById('address');
//       var fbCount = document.getElementById('fb-count');
//       var twCount = document.getElementById('tw-count');
//       address.innerHTML = url;
//       fbCount.innerHTML = facebookVisits.toString();
//       twCount.innerHTML = twitterVisits.toString();
//     }
//   });
// }