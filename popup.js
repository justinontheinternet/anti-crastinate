var optionUrl = 'chrome-extension://hgnipldbfgigmbjpkpaapcpjjofhphbp/options.html';

function sendStatus(status) {  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { active: status });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('toggle-switch');
  var buttonClasses = button.classList;
  var options = document.getElementById('options');
  var turnOn = "Enable";
  var turnOff = "Disable";
  var status;
    
  // find out whether the extension is active
  chrome.storage.sync.get('active', function(data) {    
    // if there is no value, set it to active
    if (data.active === undefined) {      
      status = true;
      chrome.storage.sync.set({ 'active': status });
      buttonClasses.remove('enable');
      buttonClasses.add('disable');
      button.innerHTML = turnOff;
    } else if (data.active === true) {
      buttonClasses.remove('enable');
      buttonClasses.add('disable');
      button.innerHTML = turnOff;
    } else {
      status === false;
      buttonClasses.remove('disable');
      buttonClasses.add('enable');
      button.innerHTML = turnOn;
    }
  });

  button.addEventListener('click', function() {
    if (button.innerHTML === turnOff) {      
      status = false;
      chrome.storage.sync.set({ 'active': status });
      sendStatus(status);
      buttonClasses.remove('disable');
      buttonClasses.add('enable');
      button.innerHTML = turnOn;
    } else {
      status = true;
      chrome.storage.sync.set({ 'active': status });
      sendStatus(status);
      buttonClasses.remove('enable');
      buttonClasses.add('disable');
      button.innerHTML = turnOff;
    }
  });

  options.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: optionUrl });
    });
  });
});
