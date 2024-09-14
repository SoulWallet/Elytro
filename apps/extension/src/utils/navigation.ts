export const navigateTo = (
  target: "popup" | "tab" | "options",
  path: string,
) => {
  switch (target) {
    case "popup":
      chrome.action.setPopup({
        popup: chrome.runtime.getURL(`popup.html#${path}`),
      });
      break;
    case "tab":
      chrome.tabs.create({
        url: chrome.runtime.getURL(`src/entries/tab/index.html#${path}`),
      });
      break;
    case "options":
      chrome.runtime.openOptionsPage();
      break;
  }
  // 通知目标页面更新路由
  // chrome.runtime.sendMessage({ type: "NAVIGATE", target, path });
};
