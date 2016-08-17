function fadeOut(ele) {
  ele.style.opacity = 1;
  
  var tick = function() {
    ele.style.opacity -= 0.01;
    
    if (ele.style.opacity < 1 && ele.style.opacity > 0) {
      ( window.requestAnimationFrame && requestAnimationFrame(tick) ) || setTimeout(tick, 16)
    }
  };

  tick();
}

document.addEventListener('DOMContentLoaded', function() {
  
  var visitInput = document.getElementById('visit-limit');
  var blockInput = document.getElementById('block-limit');
  var submit = document.getElementById('submit');
  var reset = document.getElementById('reset');
  var message = document.getElementById('message');

  var messageClasses = message.classList;
  var successMessage = "Settings saved."
  var errorMessage = "Please make sure all fields have a value greater than 0.";

  chrome.storage.sync.get(['exploreLimit', 'blockLimit'], function(data) {
    if (!data.exploreLimit) {
      visitInput.value = '20';
      chrome.storage.sync.set({'exploreLimit': '20'});
    } else {
      visitInput.value = data.exploreLimit;
    }

    if (!data.blockLimit) {
      blockInput.value = '180';
      chrome.storage.sync.set({'blockLimit': '180'});
    } else {
      blockInput.value = data.blockLimit;
    }
  });
  
  submit.addEventListener('click', function() {
    var newVisitLimit, newBlockLimit;
    var inputOne = visitInput.value;
    var inputTwo = blockInput.value;


    if ( !inputOne || inputOne < 1 || (isNaN(parseInt(inputOne))) || !inputTwo || inputTwo < 1 || (isNaN(parseInt(inputTwo))) ) {
      messageClasses.remove('success');
      messageClasses.add('error');
      message.style.opacity = 1;
      message.innerHTML = errorMessage;
    } else {
      newVisitLimit = visitInput.value;
      newBlockLimit = blockInput.value;
      messageClasses.remove('error');
      messageClasses.add('success');
      fadeOut(message);
      message.innerHTML = successMessage;
      chrome.storage.sync.set({'exploreLimit': newVisitLimit, 'blockLimit': newBlockLimit});
    }
  });

  reset.addEventListener('click', function() {
    defaultVisitLimit = '20';
    defaultBlockLimit = '180';

    messageClasses.remove('error');
    messageClasses.add('success');
    fadeOut(message);
    message.innerHTML = successMessage;
    chrome.storage.sync.set({'exploreLimit': defaultVisitLimit, 'blockLimit': defaultBlockLimit});
    visitInput.value = defaultVisitLimit;
    blockInput.value = defaultBlockLimit;
  });
});