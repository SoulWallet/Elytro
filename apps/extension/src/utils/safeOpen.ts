export const safeOpen = (url: string, target: string = '_blank') => {
  window.open(url, target, 'noreferrer noopener');
};
