var messageUrl = 'chrome-extension://hgnipldbfgigmbjpkpaapcpjjofhphbp/message.html';
var notification = {
  type: "basic",
  title: "Hurry up!",
  message: "Less than 5 minutes left to explore this site.",
  iconUrl: "icon.png"
};

// if time limit is up or time left is less than 5 min, content script will send a message here, initiating a redirect or notification
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.redirect === true) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: messageUrl });
    });
  }

  if (request.notify === true) {
    chrome.notifications.create('success', notification, function() {});
  }
});