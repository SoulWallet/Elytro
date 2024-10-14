import { ElytroDuplexMessage, ElytroMessageTypeEn } from '@/utils/message';
import mainWorldScript from './main-world?script&module';
import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';
import { PortMessageManager } from '@/utils/message/portMessageManager';

let portManager: PortMessageManager;

const dAppMessage = new ElytroDuplexMessage(
  'elytro-content-script',
  'elytro-page-provider'
);

const initDuplexMessageBetweenContentScriptAndPageProvider = () => {
  dAppMessage.connect();

  dAppMessage.listen(async (data: RequestArguments) => {
    portManager?.sendMessage('CONTENT_SCRIPT_REQUEST', data);

    await new Promise((resolve) =>
      portManager.onMessage('BUILTIN_PROVIDER_RESPONSE', (response) => {
        dAppMessage.send({
          type: ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER,
          payload: {
            method: response.method,
            response: response.data,
          },
        });
        resolve(true);
      })
    );
  });
};

initDuplexMessageBetweenContentScriptAndPageProvider();

const initRuntimeMessage = () => {
  portManager = new PortMessageManager('elytro-bg');
  portManager.connect();
};

initRuntimeMessage();

const onBackgroundReady = (msg: { name: string }) => {
  if (msg.name === RUNTIME_MESSAGE_TYPE.BG_READY && !portManager) {
    initRuntimeMessage();
  }
  return undefined;
};

chrome.runtime.onMessage.addListener(onBackgroundReady);

const injectMainWorldScript = () => {
  if (
    !document.querySelector(
      `script[src="${chrome.runtime.getURL(mainWorldScript)}"]`
    )
  ) {
    const script = Object.assign(document.createElement('script'), {
      src: chrome.runtime.getURL(mainWorldScript),
      type: 'module',
    });
    document.head.prepend(script);
    document.head.removeChild(script);
  }
};

injectMainWorldScript();
