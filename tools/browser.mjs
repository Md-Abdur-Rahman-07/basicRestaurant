import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

export const executablePath = process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined);
export async function launch() {
  return chromium.launch({ headless: true, ...(executablePath && existsSync(executablePath) ? { executablePath } : {}) });
}
export const viewports = { desktop: { width: 1440, height: 1000 }, tablet: { width: 768, height: 1024 }, mobile: { width: 390, height: 844 } };
