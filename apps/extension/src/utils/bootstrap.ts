import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';

export const bootstrap = (mainFunction: () => void) => {
  const attemptBootstrap = () => {
    chrome.runtime
      .sendMessage({ type: RUNTIME_MESSAGE_TYPE.DOM_READY })
      .then((res) => {
        if (!res) {
          setTimeout(attemptBootstrap, 100);
          return;
        }

        mainFunction();
      });
  };

  attemptBootstrap();
};
