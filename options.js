document.addEventListener('DOMContentLoaded', function() {
  var visitInput = document.getElementById('visit-limit');
  var blockInput = document.getElementById('block-limit');
  var submit = document.getElementById('submit');
  var reset = document.getElementById('reset');
  var error = document.getElementById('error');

  var errorMessage = "Please make sure all fields have a value greater than 0.";

  chrome.storage.sync.get(['visitLimit', 'blockLimit'], function(data) {
    if (!data.visitLimit) {
      visitInput.value = '20';
      chrome.storage.sync.set({'visitLimit': '20'});
    } else {
      visitInput.value = data.visitLimit;
    }

    if (!data.blockLimit) {
      blockInput.value = '180';
      chrome.storage.sync.set({'blockLimit': '180'});
    } else {
      blockInput.value = data.blockLimit;
    }
  });
// factor in when people leave value blank.
submit.addEventListener('click', function() {
  var newVisitLimit, newBlockLimit;

  if (!visitInput.value || visitInput.value < 1 || !blockInput.value || blockInput.value < 1) {
    error.innerHTML = errorMessage;
  } else {
    newVisitLimit = visitInput.value;
    newBlockLimit = blockInput.value;
    chrome.storage.sync.set({'visitLimit': newVisitLimit, 'blockLimit': newBlockLimit}, function() {
      message("settings saved");
    });
  }
});

reset.addEventListener('click', function() {
  defaultVisitLimit = '20';
  defaultBlockLimit = '180';
  chrome.storage.sync.set({'visitLimit': defaultVisitLimit, 'blockLimit': defaultBlockLimit});
  visitInput.value = defaultVisitLimit;
  blockInput.value = defaultBlockLimit;
});

});