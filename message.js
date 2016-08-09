document.addEventListener('DOMContentLoaded', function() {
  var message = document.getElementById('message');
  var messages = [
    "Stop stalling.",
    "Is it really that important right now?",
    "Get back to work.",
    "Work now. This later.",
    "Really, dude?" 
  ]

  message.innerHTML = messages[Math.floor(Math.random() * messages.length)]

});
