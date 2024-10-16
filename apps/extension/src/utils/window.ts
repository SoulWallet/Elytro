export const isWinOS = /windows/i.test(navigator?.userAgent);

const WINDOW_SIZE = {
  width: 400 + (isWinOS ? 14 : 0),
  height: 900,
};

// const event = new EventEmitter();

// // if focus other windows, then reject the approval
// browser.windows.onFocusChanged.addListener((winId) => {
//   event.emit('windowFocusChange', winId);
// });

// browser.windows.onRemoved.addListener((winId) => {
//   event.emit('windowRemoved', winId);
// });

const createWindow = async (url: string) => {
  const {
    top: cTop,
    left: cLeft,
    width: cWidth,
    height: cHeight,
  } = await chrome.windows.getCurrent({
    windowTypes: ['normal'],
  });

  const { height, width } = WINDOW_SIZE;

  const top = Math.round((cTop ?? 0) + ((cHeight ?? height) - height) / 2);
  const left = Math.round((cLeft ?? 0) + ((cWidth ?? width) - width) / 2);

  // const top = cTop;
  // const left = cLeft! + cWidth! - width;

  let currentWindow: chrome.windows.Window | undefined;

  // todo: resize window in UI
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
          currentWindow = window;
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
              currentWindow = fallbackWindow;
            }
          );
        }
      }
    );
  } catch {
    // do nth.
  }

  return currentWindow?.id;
};

const tryRemoveWindow = async (winId: number | null | undefined) => {
  if (winId) {
    await chrome.windows.remove(winId);
  }
};

const openPopupWindow = (path: string) => {
  return createWindow(
    chrome.runtime.getURL(`src/entries/side-panel/index.html#/${path}`)
  );
};

export { openPopupWindow, createWindow, tryRemoveWindow };
