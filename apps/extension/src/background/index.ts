import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';
import { sendReadyMessageToTabs } from './utils';
import { PortMessageManager } from '@/utils/message/portMessageManager';
import { walletController, WalletController } from './walletController';
import connectionManager from '@/background/services/connection';
import rpcFlow, { TProviderRequest } from '@/background/provider/rpcFlow';
import { getDAppInfoFromSender } from '@/utils/url';
import sessionManager from './services/session';
import keyring from './services/keyring';
import eventBus from '@/utils/eventBus';
import RuntimeMessage from '@/utils/message/runtimeMessage';
import { EVENT_TYPES } from '@/constants/events';
import uiReqCacheManager from '@/utils/cache/uiReqCacheManager';
import { rpcCacheManager } from '@/utils/cache/rpcCacheManager';
import { SUPPORTED_CHAIN_MAP } from '@/constants/chains';
import walletClient from './services/walletClient';

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
    // case chrome.runtime.OnInstalledReason.UPDATE:
    //   // TODO: do something
    //   break;
    // case chrome.runtime.OnInstalledReason.CHROME_UPDATE:
    //   // TODO: do something
    //   break;
    // case chrome.runtime.OnInstalledReason.SHARED_MODULE_UPDATE:
    //   // TODO: do something
    //   break;
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

  rpcCacheManager.init();

  // TODO: replace with RuntimeMessage
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
  const tabId = port.sender?.tab?.id;
  const origin = port.sender?.origin;
  if (!port.sender || !origin || !tabId) {
    return;
  }

  const providerPortManager = new PortMessageManager('elytro-bg');
  providerPortManager.connect(port);

  port.onDisconnect.addListener(() => {
    console.log('tab disconnected', tabId);
    sessionManager.removeSession(tabId, origin);
  });

  providerPortManager.onMessage('NEW_PAGE_LOADED', async () => {
    console.log('new page loaded', tabId);
    sessionManager.createSession(tabId, origin, providerPortManager);

    if (connectionManager.isConnected(origin)) {
      await keyring.tryUnlock();
      sessionManager.broadcastMessageToDApp(origin, 'connect', {
        chainId: SUPPORTED_CHAIN_MAP[walletClient.chainType].id,
      });
    }
  });

  providerPortManager.onMessage(
    'CONTENT_SCRIPT_REQUEST',
    async (data: RequestArguments, port) => {
      const tabId = port.sender?.tab?.id;

      if (!tabId || !port.sender?.origin) {
        return;
      }

      sessionManager.createSession(
        tabId,
        port.sender.origin,
        providerPortManager
      );

      const dAppInfo = await getDAppInfoFromSender(port.sender!);
      const providerReq: TProviderRequest = {
        rpcReq: data,
        dApp: dAppInfo,
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
};

type TUIRequest = {
  method: keyof WalletController;
  params: unknown[];
};

const initUIMessage = (port: chrome.runtime.Port) => {
  const UIPortManager = new PortMessageManager('elytro-ui');
  UIPortManager.connect(port);

  // WalletController handles UI request
  async function handleUIRequest(request: TUIRequest) {
    const { method, params } = request;

    if (typeof walletController[method] === 'function') {
      const res = await (
        walletController[method] as (...args: unknown[]) => unknown
      )(...params);

      uiReqCacheManager.set(method, params, res);
      return res;
    }

    throw new Error(`Method ${method} not found on ElytroWalletClient`);
  }

  async function handleUIRequestWithCache({ method, params }: TUIRequest) {
    const cache = uiReqCacheManager.get(method, params);
    if (cache) {
      handleUIRequest({ method, params });
      return cache;
    } else {
      return await handleUIRequest({ method, params });
    }
  }

  // Wallet Requests
  UIPortManager.onMessage('UI_REQUEST', async (data, port) => {
    const msgKey = `UI_RESPONSE_${data.method}`;
    try {
      const result = await handleUIRequestWithCache(data as TUIRequest);

      UIPortManager.sendMessage(msgKey, { result }, port.sender?.id);
    } catch (error) {
      UIPortManager.sendMessage(
        msgKey,
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

const initBackgroundMessage = () => {
  eventBus.on(EVENT_TYPES.HISTORY.ITEMS_UPDATED, () => {
    RuntimeMessage.sendMessage(EVENT_TYPES.HISTORY.ITEMS_UPDATED);
  });

  eventBus.on(EVENT_TYPES.HISTORY.ITEM_STATUS_UPDATED, (userOpHash, status) => {
    RuntimeMessage.sendMessage(
      `${EVENT_TYPES.HISTORY.ITEM_STATUS_UPDATED}_${userOpHash}`,
      {
        status,
      }
    );
  });
};

initBackgroundMessage();
