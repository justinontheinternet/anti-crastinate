document.addEventListener('DOMContentLoaded', function() {
  console.log("message.js");
  var message = document.getElementById('message');
  var messages = [
    "Stop stalling.",
    "Is it really that important right now?",
    "Get back to work.",
    "Get work done now, and you can do this later.",
    "Really, dude?" 
  ]

  message.innerHTML = messages[Math.floor(Math.random() * messages.length)]

});
