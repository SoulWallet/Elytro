import { POPUP_ROUTE_PATHS } from '@/entries/popup/routes';
import { TAB_ROUTE_PATHS } from '@/entries/tab/routes';

type PopupRoutePath =
  (typeof POPUP_ROUTE_PATHS)[keyof typeof POPUP_ROUTE_PATHS];
type TabRoutePath = (typeof TAB_ROUTE_PATHS)[keyof typeof TAB_ROUTE_PATHS];

export function navigateTo(target: 'popup', path: PopupRoutePath): void;
export function navigateTo(target: 'tab', path: TabRoutePath): void;

export function navigateTo(
  target: 'popup' | 'tab', //| 'options',
  path?: PopupRoutePath | TabRoutePath
) {
  switch (target) {
    case 'popup':
      chrome.action.setPopup({
        popup: chrome.runtime.getURL(`popup.html#${path}`),
      });
      break;
    case 'tab':
      chrome.tabs.create({
        url: chrome.runtime.getURL(`src/entries/tab/index.html#${path}`),
      });
      break;
    default:
      throw new Error('Invalid target');
    // case 'options':
    //   chrome.runtime.openOptionsPage();
    //   break;
  }
  // 通知目标页面更新路由
  // chrome.runtime.sendMessage({ type: "NAVIGATE", target, path });
}
