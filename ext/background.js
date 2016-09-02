function chainCallbacks(params, callbacks) {

  var list = callbacks;

  if (typeof callbacks == "function")
    list = [callbacks];

  for (var index=0; index<list.length; index++) {
    var callback = list[index];
    callback(params);
  }
};

/*
   Just keep the TLD and domain parts of the hostname
*/
function hostnameToKey(hostname) {
  return hostname.split(".").reverse().slice(0,2).join(".");
}

// By default, muted is "true"
function computeCurrentMutedState(key, params) {

  var entry = params[key] || {};
  var muted = entry.muted === undefined ? true: entry.muted;

  return muted;
};

function computeToggleState(muted) {

  // By default, the state is "muted = true"
  // So the toggle is "false"

  if (muted === undefined)
    return false;

  return !muted;
};



// ===========================================================================================


/*
    Callback
*/
function toggleStateChange(params) {

  var tabId = params.id;
  var key = params.key;
  var state = params.state;

  var isMuted = computeCurrentMutedState(key, state);
  var newState = computeToggleState(isMuted);

  var entry = {};
  entry[key] = { muted: newState };

  chrome.storage.local.set(entry, function() {

    _setBrowserFromState(newState);

    // Now actually update the tab muted state
    _updateTabMuted(tabId, newState);
  });

};

function updateTabMutedState(params) {

  var key = params.key;
  var state = params.state;
  var tabId = params.id;

  var mutedState = computeCurrentMutedState(key, state);
  _updateTabMuted(tabId, mutedState);
};

function _updateTabMuted(tabId, muted) {
  var updateProperties = {
    muted: muted
  };
  chrome.tabs.update(tabId, updateProperties);
};


/*
    Callback
 */
function setBrowserIconState(params) {

  var key = params.key;
  var state = params.state;

  var isMuted = computeCurrentMutedState(key, state);

  _setBrowserFromState(isMuted);
};

function _setBrowserFromState(isMuted) {

  var whichIcon = "perma-mute-128.png";

  if (isMuted === false)
      whichIcon = "perma-unmute-128.png";

  _setBrowserIcon(whichIcon);

};

function _setBrowserIcon(iconId) {
  chrome.browserAction.setIcon({
    path: iconId
  });
};


// =============================================================================



function getAndAction(tab_or_tabId, callbacks) {

  var tabId = tab_or_tabId;

  if (typeof tab_or_tabId != "number")
    tabId = tab.id;

  _getAndActionWithTabId(tabId, callbacks);
};


function _getAndActionWithTabId(tabId, callbacks) {

  chrome.tabs.get(tabId, function(tab) {

    var url = tab.url;
    var tabUrl = new URL(url);
    var tabHostname = tabUrl.hostname;
    var key = hostnameToKey(tabHostname);

    _getAndActionWithKey(tabId, key, callbacks);
  });

};

function _getAndActionWithKey(tabId, key, callbacks) {

  if (key === undefined)
    return;

  chrome.storage.local.get(key, function(state) {

    //console.debug(" > Key ", key," > State associated: ", state);

    chainCallbacks({
      id: tabId
      ,key: key
      ,state: state
    }, callbacks);
  });

};


// ======================================================================== EVENTS

/*
    {status: "loading" }
    {status: "complete"}
    {mutedInfo: {muted: Boolean} }

    - IF not "state" stored ==> by default, mute
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if (changeInfo.status != 'complete')
    return;

  getAndAction(tabId, [setBrowserIconState, updateTabMutedState]);
});



chrome.browserAction.onClicked.addListener(function(tab) {
  getAndAction(tab.id, toggleStateChange);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {

  var tabId = activeInfo.tabId;
  //var winId = activeInfo.windowId;

  getAndAction(tabId, [setBrowserIconState, updateTabMutedState]);
});
