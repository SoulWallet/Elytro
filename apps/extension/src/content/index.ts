import ElytroMessage from '@/utils/message';
import mainWorldScript from './main-world?script&module';

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

const message = new ElytroMessage(
  'elytro-content-script',
  'elytro-page-provider'
);

message.send({
  type: 'test',
  data: 'test123',
});
