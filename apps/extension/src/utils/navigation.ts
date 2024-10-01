import { SIDE_PANEL_ROUTE_PATHS } from '@/entries/side-panel/routes';
import { TAB_ROUTE_PATHS } from '@/entries/tab/routes';
import { navigate } from 'wouter/use-hash-location';

// for now, we only support tab and side-panel
const getCurrentType = () => location.pathname.split('/')[3];

type SidePanelRoutePath =
  (typeof SIDE_PANEL_ROUTE_PATHS)[keyof typeof SIDE_PANEL_ROUTE_PATHS];
type TabRoutePath = (typeof TAB_ROUTE_PATHS)[keyof typeof TAB_ROUTE_PATHS];

export function navigateTo(target: 'popup', path: SidePanelRoutePath): void;
export function navigateTo(target: 'tab', path: TabRoutePath): void;
export function navigateTo(
  target: 'side-panel',
  path: SidePanelRoutePath
): void;

export function navigateTo(
  target: 'popup' | 'tab' | 'side-panel', //| 'options' | 'notification',
  path: SidePanelRoutePath | TabRoutePath
) {
  const inSameMode = getCurrentType() === target;

  // if in same mode, just navigate in router
  if (inSameMode) {
    navigate(path);
    return;
  }

  switch (target) {
    // TODO: remove popup. no need for it.
    case 'popup':
      chrome.action.setPopup({
        popup: chrome.runtime.getURL(`popup.html#${path}`),
      });
      break;
    case 'side-panel':
      chrome.tabs.getCurrent().then((tab) => {
        if (tab?.id || tab?.windowId) {
          chrome.sidePanel.open({
            tabId: tab.id,
            windowId: tab.windowId,
          });
        }
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
    // case 'notification':
    //   chrome.notifications.create({
    //     type: 'basic',
    //     title: 'Elytro',
    //     message: 'Elytro is running',
    //     iconUrl: chrome.runtime.getURL('icon.png'),
    //   });
    //   break;
  }
  // 通知目标页面更新路由
  // chrome.runtime.sendMessage({ type: "NAVIGATE", target, path });
}
