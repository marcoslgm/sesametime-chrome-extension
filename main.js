var app = {
    getStatus: function (cb) {
        app.requesting()
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `https://panel.sesametime.com/admin/users/checks/${app.userId}/0`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                app.updated = new Date().getTime()
                cb(xhr.responseText)
            }
        }
        xhr.send();
    },
    sendTrack: function (cb) {
        app.requesting()
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `https://panel.sesametime.com/checks/json_check/${app.userId}/0/1`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                cb && cb(xhr.responseText)
                app.updateIcon()
            }
        }
        xhr.send();
    },
    updateIcon: function () {
        app.getUserId(
            app.getStatus(res => {
                app.isLoggedIn = app.userId && res.indexOf('UserLoginForm') === -1
                app.isOnline = app.isLoggedIn && res.indexOf('Check OUT') > -1

                if (!app.isLoggedIn) {
                    chrome.browserAction.enable()
                    chrome.browserAction.setBadgeText({ text: 'LOG' });
                    chrome.browserAction.setBadgeBackgroundColor({ color: '#AAA' })
                } else if (app.isOnline) {
                    chrome.browserAction.enable()
                    chrome.browserAction.setBadgeText({ text: 'ON' });
                    chrome.browserAction.setBadgeBackgroundColor({ color: '#0A0' })
                } else {
                    chrome.browserAction.enable()
                    chrome.browserAction.setBadgeText({ text: 'OFF' });
                    chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' })
                }
            })
        )
    },
    openWeb: function () {
        chrome.tabs.create({ url: `https://panel.sesametime.com/admin/users/checks/${app.userId}/0` });  
    },
    getUserId: function(cb) {
        chrome.cookies.get({url: 'https://panel.sesametime.com', name: 'access_url'}, (cookie) => {
            app.userId = cookie && cookie.value && cookie.value.split('/') && cookie.value.split('/')[6]
        })
    },
    requesting: function () {
        chrome.browserAction.disable()
        chrome.browserAction.setBadgeText({ text: '···' });
        chrome.browserAction.setBadgeBackgroundColor({ color: '#FA0' })
    },
    userId: undefined,
    isLoggedIn: false,
    isOnline: undefined,
    updated: undefined
}
window.app = app

function start() {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        var isSesametimeUrl = tabs[0] && tabs[0].url && tabs[0].url.indexOf('sesametime.com') > -1
        var isOutdated = !app.updated || app.updated < (new Date().getTime() - 2 * 1000 * 60)
        
        // Only opdate status if it is outdated or current tab is sesametime.com page.
        if (isOutdated || isSesametimeUrl) {
            app.updateIcon()
        }
    });
    
}


chrome.webNavigation.onCompleted.addListener(start, { url: [] });