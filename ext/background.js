chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("Browser Action clicked ! ", tab.id);
});


chrome.commands.onCommand.addListener(function(command) {


  if (command == "CmdAlternateMuteUnmute" ) {

    console.debug('Alternate Mute/Unmute pressed');

    chrome.tabs.getSelected(null, tab => {
				chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
			});
  };

});

/*
    {status: "loading" }
    {status: "complete"}
    {mutedInfo: {muted: Boolean} }
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  //console.debug("Tab Updated, ", tabId, changeInfo, tab);

  if (changeInfo.status != 'complete')
    return;

  var tabUrl = new URL(tab.url);
  var tabDomain = tabUrl.hostname;

  console.debug("Tab(",tabId,") just loaded a page from domain: ", tabDomain);

  chrome.storage.local.get(tabDomain, function(state) {



  });

});
