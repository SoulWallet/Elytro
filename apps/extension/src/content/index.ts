import { ElytroDuplexMessage, ElytroMessageTypeEn } from '@/utils/message';
import mainWorldScript from './main-world?script&module';
import { PortMessageManager } from '@/utils/message/portMessageManager';

let portManager: PortMessageManager;

const dAppMessage = new ElytroDuplexMessage(
  'elytro-content-script',
  'elytro-page-provider'
);

const initDuplexMessageBetweenContentScriptAndPageProvider = () => {
  dAppMessage.connect();

  dAppMessage.listen(async ({ uuid, payload }) => {
    portManager?.sendMessage('CONTENT_SCRIPT_REQUEST', {
      uuid,
      payload,
    });
  });
};

initDuplexMessageBetweenContentScriptAndPageProvider();

const initRuntimeMessage = () => {
  portManager = new PortMessageManager('elytro-bg');
  portManager.connect();

  portManager.onMessage(ElytroMessageTypeEn.MESSAGE, (data) => {
    dAppMessage.send({
      type: ElytroMessageTypeEn.MESSAGE,
      payload: data,
    });
  });

  portManager.onMessage('BUILTIN_PROVIDER_RESPONSE', (response) => {
    dAppMessage.send({
      type: ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER,
      uuid: response.uuid,
      payload: {
        method: response.method,
        response: response.data,
      },
    });
  });
};

initRuntimeMessage();

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
