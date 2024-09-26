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
}
