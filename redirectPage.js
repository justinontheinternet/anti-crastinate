var messageUrl = 'chrome-extension://hgnipldbfgigmbjpkpaapcpjjofhphbp/message.html';

// if time limit is up, content script will send a message here, initiating a redirect
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("request is:", request);
  if (request.redirect === true) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: messageUrl });
    });
  }
});