import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Phase-0 spike note: webkit + firefox were installed best-effort
    // (`npx playwright install webkit firefox`, both succeeded) and the spike spec
    // was run on all three engines once — results are recorded in
    // `.superpowers/sdd/task-0-report.md`. The webkit/firefox projects are NOT
    // left enabled here because the spike spec (and some existing app specs) fail
    // on them, which would break the default chromium-only `npm run e2e`. To
    // re-measure manually:
    //   { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
    //   { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
