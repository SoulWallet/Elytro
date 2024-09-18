import { TAB_ROUTE_PATHS } from '@/entries/tab/routes';
import { navigateTo } from '@/utils/navigation';

console.log('Elytro: Background script loaded');

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    navigateTo('tab', TAB_ROUTE_PATHS.Launch);
  }
});
