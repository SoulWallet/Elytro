export const isWinOS = /windows/i.test(navigator?.userAgent);
import { EventEmitter } from 'events';

const iPhone14ProMaxSize = {
  width: 430,
  height: 932,
};

const WINDOW_SIZE = {
  width: iPhone14ProMaxSize.width + (isWinOS ? 14 : 0),
  height: iPhone14ProMaxSize.height,
};

const approvalWindowEvent = new EventEmitter();

const ApprovalWindowEventNameEn = {
  // FocusChange: 'windowFocusChange',
  Removed: 'windowRemoved',
};

// chrome.windows.onFocusChanged.addListener((winId) => {
//   approvalWindowEvent.emit(ApprovalWindowEventNameEn.FocusChange, winId);
// });

chrome.windows.onRemoved.addListener((winId) => {
  approvalWindowEvent.emit(ApprovalWindowEventNameEn.Removed, winId);
});

const createWindow = async (url: string): Promise<number | undefined> => {
  const {
    top: cTop,
    left: cLeft,
    width: cWidth,
    height: cHeight,
  } = await chrome.windows.getCurrent({
    windowTypes: ['normal'],
  });

  return new Promise((resolve) => {
    const { height, width } = WINDOW_SIZE;

    const top = Math.round((cTop ?? 0) + ((cHeight ?? height) - height) / 2);
    const left = Math.round((cLeft ?? 0) + ((cWidth ?? width) - width) / 2);

    try {
      chrome.windows.create(
        {
          url,
          focused: true,
          type: 'popup',
          width,
          height,
          top,
          left,
        },
        (window) => {
          if (window) {
            resolve(window?.id);
          } else {
            chrome.windows.create(
              {
                url,
                focused: true,
                type: 'popup',
                width,
                height,
                top: 0,
                left: 0,
              },
              (fallbackWindow) => {
                resolve(fallbackWindow?.id);
              }
            );
          }
        }
      );
    } catch {
      // do nth
    }
  });
};

const tryRemoveWindow = async (winId: number | null | undefined) => {
  try {
    if (winId) {
      await chrome.windows.remove(winId);
    }
  } catch {
    // do nth
  }
};

const openPopupWindow = async (path: string) => {
  return await createWindow(
    chrome.runtime.getURL(`src/entries/side-panel/index.html#/${path}`)
  );
};

export {
  openPopupWindow,
  createWindow,
  tryRemoveWindow,
  approvalWindowEvent,
  ApprovalWindowEventNameEn,
};
