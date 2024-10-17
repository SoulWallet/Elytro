import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';
import { sendReadyMessageToTabs } from './utils';
import { PortMessageManager } from '@/utils/message/portMessageManager';
// import walletClient, {
//   ElytroWalletClient,
// } from '@/background/services/walletClient';

import { walletController, WalletController } from './walletController';
import connectionManager from '@/background/services/connection';
import rpcFlow, { TProviderRequest } from '@/background/provider/rpcFlow';
import { getDAppInfoFromSender } from '@/utils/url';

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
  // await keyring.restore();
  await connectionManager.restore();
  await sendReadyMessageToTabs();

  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.type === RUNTIME_MESSAGE_TYPE.DOM_READY) {
      sendResponse(true);
    }
  });
};

initApp();

/**
 * Init the message between background and (content script / page provider)
 * @param port
 */
const initContentScriptAndPageProviderMessage = (port: chrome.runtime.Port) => {
  if (!port?.sender?.tab) {
    return;
  }

  const providerPortManager = new PortMessageManager('elytro-bg');
  providerPortManager.connect(port);

  providerPortManager.onMessage(
    'CONTENT_SCRIPT_REQUEST',
    async (data: RequestArguments, port) => {
      const providerReq: TProviderRequest = {
        rpcReq: data,
        dApp: await getDAppInfoFromSender(port.sender!),
      };

      try {
        const result = await rpcFlow(providerReq);

        providerPortManager.sendMessage(
          'BUILTIN_PROVIDER_RESPONSE',
          {
            method: data.method,
            data: result,
          },
          port.sender?.id
        );
      } catch (error) {
        providerPortManager.sendMessage(
          'BUILTIN_PROVIDER_RESPONSE',
          {
            method: data.method,
            error: (error as Error).message,
          },
          port.sender?.id
        );
      }
    }
  );

  // providerPortManager.onMessage(
  //   'WALLET_CLIENT_REQUEST',
  //   async (message, port) => {
  //     const result = await builtinProvider.request(message.data);
  //     providerPortManager.sendMessage(
  //       'WALLET_CLIENT_RESPONSE',
  //       { result },
  //       port.sender?.id
  //     );
  //   }
  // );
};

const initUIMessage = (port: chrome.runtime.Port) => {
  const UIPortManager = new PortMessageManager('elytro-ui');
  UIPortManager.connect(port);

  async function handleUIRequest(request: {
    method: keyof WalletController;
    params: unknown[];
  }) {
    const { method, params } = request;

    if (typeof walletController[method] === 'function') {
      return await (
        walletController[method] as (...args: unknown[]) => unknown
      )(...params);
    }

    throw new Error(`Method ${method} not found on ElytroWalletClient`);
  }

  UIPortManager.onMessage('UI_REQUEST', async (data, port) => {
    try {
      const result = await handleUIRequest(
        data as {
          method: keyof WalletController;
          params: unknown[];
        }
      );
      UIPortManager.sendMessage('UI_RESPONSE', { result }, port.sender?.id);
    } catch (error) {
      UIPortManager.sendMessage(
        'UI_RESPONSE',
        { error: (error as Error).message },
        port.sender?.id
      );
    }
  });
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'elytro-ui') {
    initUIMessage(port);

    return;
  }

  initContentScriptAndPageProviderMessage(port);
});
