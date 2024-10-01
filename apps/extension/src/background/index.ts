import keyring from '@/services/keyring';

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

function init() {
  // restore keyring state from local storage
  keyring.restore();

  // sdkKeyring.initialize();
}

init();
