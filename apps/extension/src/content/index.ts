import {
  ElytroRuntimeMessage,
  ElytroDuplexMessage,
  ElytroMessageTypeEn,
} from '@/utils/message';
import mainWorldScript from './main-world?script&module';
import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';

let runtimeMessage: ElytroRuntimeMessage;

const dAppMessage = new ElytroDuplexMessage(
  'elytro-content-script',
  'elytro-page-provider'
);

const initDuplexMessageBetweenContentScriptAndPageProvider = () => {
  dAppMessage.connect();

  dAppMessage.listen(async (data: RequestArguments) => {
    runtimeMessage?.sendMessage({
      type: data.method,
      data,
    });

    await new Promise((resolve) =>
      runtimeMessage?.listen(({ type, data }) => {
        dAppMessage.send({
          type: ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER,
          payload: {
            method: type as ProviderMethodType,
            response: data,
          },
        });
        resolve(true);
      })
    );
  });
};

initDuplexMessageBetweenContentScriptAndPageProvider();

const initRuntimeMessage = () => {
  runtimeMessage = new ElytroRuntimeMessage('elytro-content-script');
  runtimeMessage.connect();
};

initRuntimeMessage();

const onBackgroundReady = (msg: { name: string }) => {
  if (msg.name === RUNTIME_MESSAGE_TYPE.BG_READY && !runtimeMessage) {
    initRuntimeMessage();
  }
  return undefined;
};

console.log('c', new Date());
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
