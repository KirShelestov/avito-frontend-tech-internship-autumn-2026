import { defineConfig, devices } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3000';

/**
 * E2E-тесты против реального backend из `../server` и dev-сервера клиента (без MSW).
 * Перед запуском один раз: `npx playwright install chromium` и `npm ci` в `../server`.
 */
export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm --prefix ../server run dev',
      url: `${BACKEND_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev -- --port 5173',
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        VITE_USE_MSW: 'false',
        VITE_API_URL: BACKEND_URL,
        VITE_WS_URL: 'ws://localhost:3000/api/v1/ws',
      },
    },
  ],
});
