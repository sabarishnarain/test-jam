window.expandHelp = function() {
  document.getElementById("helpPanel").style.padding = '3em';
  document.getElementById("helpPanel").style.width = '250px';
}

window.collapseHelp = function() {
  document.getElementById("helpPanel").style.padding = '0'
  document.getElementById("helpPanel").style.width = "0";
}

window.showSnackbar = function showSnackbar() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  
  // Add the "show" class to DIV
  x.className = "show";
  
  // After 10 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}

