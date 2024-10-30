import path from 'path';
import fs from 'fs';
import url from 'url';
import {
  test as base,
  expect,
  chromium,
  type BrowserContext,
  Page,
} from '@playwright/test';

/* side panel */
process.env.PW_CHROMIUM_ATTACH_TO_OTHER = '1';

const extensionDir = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '..',
  'dist'
);
const archiveDir = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'archive'
);
const videoDir = path.join(archiveDir, 'screenrecord');
const networkDir = path.join(archiveDir, 'network');
if (!fs.existsSync(networkDir)) {
  fs.mkdirSync(networkDir, { recursive: true });
}
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

function skipURL(url: string) {
  return (
    url.startsWith('chrome-extension://') ||
    url.endsWith('.js') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.gif') ||
    url.endsWith('.zip')
  );
}

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  startPage: Page;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    if (!fs.existsSync(extensionDir)) {
      throw new Error(`extension not exist: ${extensionDir}`);
    }
    const context = await chromium.launchPersistentContext('', {
      recordVideo: {
        dir: videoDir,
      },
      headless: false,
      args: [
        `--disable-extensions-except=${extensionDir}`,
        `--load-extension=${extensionDir}`,
      ],
    });
    const networkLogs = path.join(
      networkDir,
      new Date().toUTCString().replace(',', ' ') +
        '-' +
        Math.floor(Math.random() * 1000) +
        '.txt'
    );
    context.on('request', (request) => {
      if (skipURL(request.url().toLowerCase())) {
        return;
      }
      const data =
        JSON.stringify({
          time: new Date().toLocaleTimeString(),
          type: 'request',
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData(),
        }) + '\n';
      fs.writeFileSync(networkLogs, data, {
        flag: 'a',
      });
    });

    context.on('response', async (response) => {
      if (skipURL(response.url().toLowerCase())) {
        return;
      }
      let body = '<NULL>';
      try {
        body = await response.text();
      } catch (error) {
        console.error(error);
      }
      const data =
        JSON.stringify({
          time: new Date().toLocaleTimeString(),
          type: 'response',
          url: response.url(),
          status: response.status(),
          headers: response.headers(),
          body: body,
        }) + '\n';
      fs.writeFileSync(networkLogs, data, {
        flag: 'a',
      });
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // let pages = await context.pages();
    // let extensionId = "";
    // while (extensionId === "") {
    //     await new Promise(resolve => setTimeout(resolve, 100));
    //     if (pages.length > 0) {
    //         for (const page of pages) {
    //             const url = page.url();
    //             if (url.startsWith("chrome-extension://")) {
    //                 pages = await context.pages();
    //                 extensionId = url.split("/")[2];
    //                 break;
    //             }
    //         }
    //     }
    // }

    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }
    const extensionId = background.url().split('/')[2];

    let hasExtensionPage = false;
    while (hasExtensionPage === false) {
      const pages = await context.pages();
      for (const page of pages) {
        const url = page.url();
        if (url.startsWith('chrome-extension://')) {
          hasExtensionPage = true;
          break;
        }
      }
      if (hasExtensionPage) {
        for (const page of pages) {
          const url = page.url();
          if (url === 'about:blank') {
            await page.close();
          }
        }
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await use(extensionId);
  },
  startPage: async ({ context }, use) => {
    let page: Page | null = null;
    while (page === null) {
      const pages = await context.pages();
      for (const _page of pages) {
        const url = _page.url();
        if (url.startsWith('chrome-extension://')) {
          page = _page;
          break;
        }
      }
    }
    await use(page!);
  },
});

export { expect };
