function sendStatus(status) {
  console.log("sendStatus called. sending message from popup.js");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { active: status });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('toggle-switch');
  var turnOn = "Turn on";
  var turnOff = "Turn off";
  var status;
  
  console.log('step 1: popup loaded. variables set.');
  // find out whether the extension is active
  chrome.storage.sync.get('active', function(data) {
    console.log("step 2: data.active is", data.active);
    // if there is no value, set it to active
    if (data.active === undefined) {
      console.log("step 3a. no data.active value");
      status = true;
      chrome.storage.sync.set({ 'active': status });
      button.innerHTML = turnOff;
      // sendStatus(status);
    } else if (data.active === true) {
      console.log("step 3b. data.active === true");
      button.innerHTML = turnOff;
    } else {
      console.log("step 3c. data.active === false (else)");
      status === false;
      button.innerHTML = turnOn;
    }
  });

  button.addEventListener('click', function() {
    console.log("step 4 checking for button value");
    if (button.innerHTML === turnOff) {
      console.log("step 4a: button value is turnOff");
      status = false;
      chrome.storage.sync.set({ 'active': status });
      sendStatus(status);
      button.innerHTML = turnOn;
    } else {
      console.log("step 4b button value is turnOn");
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