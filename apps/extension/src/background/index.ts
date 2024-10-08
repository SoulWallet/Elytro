import { ElytroRuntimeMessage } from '@/utils/message';
import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';
import { sendReadyMessageToTabs } from './utils';
import builtinProvider from '@/services/providers/builtinProvider';

chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case chrome.runtime.OnInstalledReason.INSTALL:
      // wait for 200ms to ensure the page is ready
      setTimeout(() => {
        chrome.tabs.create({
          url: chrome.runtime.getURL(`src/entries/tab/index.html#/launch`),
        });
      }, 200);
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

const initApp = async () => {
  await sendReadyMessageToTabs();

  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.type === RUNTIME_MESSAGE_TYPE.DOM_READY) {
      sendResponse(true);
    }
  });
};

initApp();

const initRuntimeMessageBetweenContentScriptAndBackground = (
  port: chrome.runtime.Port
) => {
  // have dapp
  if (!port.sender?.tab) {
    return;
  }

  const runtimeMessage = new ElytroRuntimeMessage('elytro-background', port);
  runtimeMessage.connect();

  runtimeMessage.listen(async ({ type, data }) => {
    const res = await builtinProvider.request(data);

    runtimeMessage.sendMessage({
      type,
      data: res,
    });
  });
};

chrome.runtime.onConnect.addListener((port) => {
  initRuntimeMessageBetweenContentScriptAndBackground(port);
});
