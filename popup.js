var app = chrome.extension.getBackgroundPage().app;

if (!app.isLoggedIn) {
  document.getElementById('loggedOut').hidden = false
  document.getElementById('online').hidden = true
  document.getElementById('offline').hidden = true
} else if (app.isOnline) {
  document.getElementById('loggedOut').hidden = true
  document.getElementById('online').hidden = false
  document.getElementById('offline').hidden = true
} else {
  document.getElementById('loggedOut').hidden = true
  document.getElementById('online').hidden = true
  document.getElementById('offline').hidden = false
}

function action() {
  if (app.isLoggedIn) {
    app.sendTrack()
  } else {
    app.openWeb()
  }
  window.close()
}
document.getElementById('actionButtonLogIn').onclick = action
document.getElementById('actionButtonSetOn').onclick = action
document.getElementById('actionButtonSetOff').onclick = action

document.getElementById('webLink').onclick = function () {
  app.openWeb()
  window.close()
}