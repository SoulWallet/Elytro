export const getDAppInfoFromSender = async (
  sender: chrome.runtime.MessageSender
) => {
  const { tab, origin } = sender;
  const tabInfo = tab?.id ? await chrome.tabs.get(tab.id) : null;

  return {
    origin,
    name: tabInfo?.title || 'unknown',
    icon: tabInfo?.favIconUrl || '',
  };
};
