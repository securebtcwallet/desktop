var warning_url = "https://www.securebtcwallet.com/warnings.html";
var update_url =  "https://www.securebtcwallet.com/update.html";

function checkUpdates()
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", warning_url, false ); // false for synchronous request
  xmlHttp.send();
  var res = parseFloat(xmlHttp.responseText.trim());
  if(res && res > 0.2) {
    alert("This version is insecure. Make sure you back up your seed phrase and go to " + update_url + " to update.");
  }
}
