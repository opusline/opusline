// The README's screenshots, taken from a running dev stack on the demo account
// with three years of history behind it:
//
//   cd apps/api && sh scripts/php.sh php artisan migrate:fresh --seed --seeder=VolumeSeeder
//   pnpm --filter @opusline/web dev          # http://localhost:3000
//   pnpm --filter @opusline/e2e screenshots  # writes docs/images/*.png
//
// Desktop shots are 1512×945 at 2× (the size a 14" laptop renders), phone shots
// 390×844 at 3×. BASE_URL overrides the stack's address. Every screen is read
// as the seeded account, so the files show fiction only.

import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../docs/images",
);
const ACCOUNT = { email: "test@example.com", password: "password" };
const THEME = { light: 1, dark: 2 };

const DESKTOP = {
  viewport: { width: 1512, height: 945 },
  deviceScaleFactor: 2,
};
const PHONE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

/** @type {Array<{ file: string, path: string, theme: "light" | "dark", device?: typeof PHONE }>} */
const SHOTS = [
  { file: "week-light.png", path: "/week", theme: "light" },
  { file: "cra-light.png", path: "/cra", theme: "light" },
  { file: "invoices-light.png", path: "/invoices", theme: "light" },
  { file: "revenue-light.png", path: "/revenue", theme: "light" },
  { file: "expenses-light.png", path: "/expenses", theme: "light" },
  { file: "declarations-light.png", path: "/declarations", theme: "light" },
  { file: "treasury-dark.png", path: "/treasury", theme: "dark" },
  { file: "bank-light.png", path: "/bank-account", theme: "light" },
  { file: "deadlines-light.png", path: "/deadlines", theme: "light" },
  { file: "week-phone.png", path: "/week", theme: "light", device: PHONE },
  {
    file: "treasury-phone.png",
    path: "/treasury",
    theme: "dark",
    device: PHONE,
  },
];

async function signIn(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByTestId("login-email").fill(ACCOUNT.email);
  await page.getByTestId("login-password").fill(ACCOUNT.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

/** The theme is an account setting; the API answers with the cookie the SPA boots from. */
async function setTheme(page, theme) {
  const cookies = await page.context().cookies(BASE_URL);
  const xsrf = cookies.find((cookie) => cookie.name === "XSRF-TOKEN");
  const response = await page.request.put(`${BASE_URL}/api/user/theme`, {
    data: { theme: THEME[theme] },
    headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrf?.value ?? "") },
  });

  if (!response.ok()) {
    throw new Error(`PUT /api/user/theme answered ${response.status()}`);
  }
}

async function capture(browser, shot) {
  const context = await browser.newContext({
    ...(shot.device ?? DESKTOP),
    locale: "fr-FR",
    colorScheme: shot.theme,
  });
  const page = await context.newPage();

  await signIn(page);
  await setTheme(page, shot.theme);
  await page.goto(`${BASE_URL}${shot.path}`);
  await page.waitForLoadState("networkidle");
  // Charts and counters animate in; a short settle keeps them off mid-frame.
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT_DIR, shot.file) });
  await context.close();

  console.log(`${shot.file} ← ${shot.path} (${shot.theme})`);
}

const browser = await chromium.launch();

try {
  for (const shot of SHOTS) {
    await capture(browser, shot);
  }
} finally {
  await browser.close();
}
