# chrome-mute-tab-helper

Are you tired of annoying pages that load and start playing audio right away ?

By default, when a tab gets loaded with a new domain (one not already tracked by the extension), the audio state will be muted (state: perma-mute).
The user has now the following choices:

* The user can unmute the domain visited in the browser tab through the page action button - this will effectively unmute the tab for the lifetime of the tab
* The user can unmute the domain permanently through the page action button (state: perma-unmute)

When a browser tab is opened on a domain of state "perma-unmute", the user has the choice to revert to "perma-mute" through the page action button.

History
=======

0.0.1
