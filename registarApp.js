let password = document.getElementById('password');
let username = document.getElementById('userame');
let repeatPassword = document.getElementById('repeatPassword');


// When the user clicks on the password field, show the message box
password.onfocus = function () {
    document.getElementById("message").style.display = "block";
  };
  
  // When the user clicks outside of the password field, hide the message box
  password.onblur = function () {
    document.getElementById("message").style.display = "none";
  };

