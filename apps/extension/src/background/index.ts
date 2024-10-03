import keyring from '@/services/keyring';
// import builtinProvider from '@/services/providers/builtinProvider';
// handle request from content script(page provider) and proxy to builtin provider

chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case chrome.runtime.OnInstalledReason.INSTALL:
      // !CANNOT USE navigateTo HERE
      // navigateTo('tab', TAB_ROUTE_PATHS.Launch);
      chrome.tabs.create({
        url: chrome.runtime.getURL(`src/entries/tab/index.html#/create`),
      });
      break;
    case chrome.runtime.OnInstalledReason.UPDATE:
      // TODO: do something
      break;
    case chrome.runtime.OnInstalledReason.CHROME_UPDATE:
      // TODO: do something
      break;
    case chrome.runtime.OnInstalledReason.SHARED_MODULE_UPDATE:
      // TODO: do something
      break;
  }
});

// allow side panel to open when clicking the extension icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

function init() {
  // restore keyring state from local storage

  keyring.restore();
}

init();
