var visitLimit, blockLimit;

document.addEventListener('DOMContentLoaded', function() {
  var visitInput = document.getElementById('visit-limit');
  var blockInput = document.getElementById('block-limit');

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

});