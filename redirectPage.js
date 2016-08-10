var messageUrl = 'chrome-extension://hgnipldbfgigmbjpkpaapcpjjofhphbp/message.html';
var notification = {
  type: "basic",
  title: "Hurry up!",
  message: "Less than 5 minutes left to explore this site.",
  iconUrl: "icon.png"
};

function extractDomain(url) {
  var domain;
  // if '://' occurs, split and take third item in resulting array
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  //find & remove port number
  domain = domain.split(':')[0];

  return domain;
};

// if time limit is up or time left is less than 5 min, content script will send a message here, initiating a redirect or notification
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.redirect === true) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: messageUrl });
    });
  }

  if (request.notify === true) {
    chrome.history.search({ text: '', maxResults: 2}, function(data) {
      var currentPage = extractDomain(data[0].url);
      var lastPage = extractDomain(data[1].url);

      if (currentPage !== lastPage) {
        chrome.notifications.create('success', notification, function() {});
      }
    });
  }
});