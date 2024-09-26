// @ts-ignore
import mainWorld from './main-world?script&module';

const script = document.createElement('script');
script.src = chrome.runtime.getURL(mainWorld);
script.type = 'module';
document.head.prepend(script);
