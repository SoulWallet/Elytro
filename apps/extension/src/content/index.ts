import ElytroDuplexMessage, { ElytroMessageTypeEn } from '@/utils/message';
import mainWorldScript from './main-world?script&module';
import builtInProvider from '@/services/providers/builtinProvider';

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

const contentScriptMessage = new ElytroDuplexMessage(
  'elytro-content-script',
  'elytro-page-provider'
);

contentScriptMessage.connect();

contentScriptMessage.listen(async (data) => {
  const response = await builtInProvider.request(data);

  console.log('Elytro: content script sending response', data.method, response);
  contentScriptMessage.send({
    type: ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER,
    payload: {
      method: data.method,
      response,
    },
  });
});
