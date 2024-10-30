import { test, expect } from './fixtures.js';
import { Page } from '@playwright/test';
import clipboard from 'clipboardy';
import { ethers } from 'ethers';

const password = '!AkZ*jk2wsx';

test.describe('CI', () => {
  test('init', async ({ context, extensionId, startPage }) => {
    test.setTimeout(1000 * 60 * 2);

    await startPage
      .getByRole('button', { name: 'Create wallet for free' })
      .click();
    await startPage.getByPlaceholder('Enter your password').click();
    await startPage.getByPlaceholder('Enter your password').fill(password);
    await startPage.getByPlaceholder('Enter password again').click();
    await startPage.getByPlaceholder('Enter password again').fill(password);
    await startPage.getByRole('button', { name: 'Submit' }).click();

    let sidebarPage: Page | null = null;
    // chrome-extension://xxxx/src/entries/side-panel/index.html
    while (sidebarPage === null) {
      const pages = await context.pages();
      for (const page of pages) {
        const url = page.url();
        if (
          url.startsWith(`chrome-extension://${extensionId}`) &&
          url.includes('/side-panel')
        ) {
          sidebarPage = page;
          break;
        }
      }
      await startPage.waitForTimeout(100);
    }
    // set sidebar page size
    await sidebarPage.setViewportSize({ width: 400, height: 600 });
    await sidebarPage.evaluate(() => {
      document.documentElement.style.width = '360px';
      document.documentElement.style.height = '600px';
    });

    let provider: ethers.JsonRpcProvider | null = null;
    // get chain name
    const chainName =
      (await sidebarPage.getByTestId('chain_name').textContent())?.trim() ?? '';
    console.log(chainName);
    if (chainName === 'Optimism Sepolia') {
      provider = new ethers.JsonRpcProvider('https://sepolia.optimism.io');
    } else {
      expect(false, `Unsupported chain: ${chainName}`);
    }
    // copy address
    await sidebarPage.getByTestId('copy_icon').click();
    // get address
    const address = clipboard.readSync();
    console.log(address);
    // on chain check, must not be a contract
    let code = await provider!.getCode(address);
    expect(code == '0x', `Address is a contract: ${address}`);

    {
      // close dialog if exist :getByRole('button', { name: 'Close' });
      try {
        await sidebarPage.getByRole('button', { name: 'Close' }).click();
      } catch (_) {
        // console.log('close button not found');
      }
    }

    // click 'Activate account'
    await sidebarPage.getByRole('button', { name: 'Activate account' }).click();
    // click 'Confirm'
    await sidebarPage.getByRole('button', { name: 'Confirm' }).click();
    // on chain check, time out 10s
    const ts_start = Date.now();
    let isActivated = false;
    while (Date.now() - ts_start < 1000 * 10) {
      code = await provider!.getCode(address);
      if (code !== '0x') {
        isActivated = true;
        break;
      }
      await sidebarPage.waitForTimeout(1000);
    }
    expect(isActivated, 'Account activation failed');
    console.log('success');
  });
});
