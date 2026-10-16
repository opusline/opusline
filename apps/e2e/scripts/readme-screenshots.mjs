// The README's screenshots, taken from a running dev stack on the demo account
// with three years of history behind it:
//
//   cd apps/api && sh scripts/php.sh php artisan migrate:fresh --seed --seeder=VolumeSeeder
//   pnpm --filter @opusline/web dev          # http://localhost:3000
//   pnpm --filter @opusline/e2e screenshots  # writes docs/images/*.png
//
// Desktop shots are 1680×1050 at 2× (the week grid needs the width), phone shots
// 390×844 at 3×. BASE_URL overrides the stack's address. Every screen is read
// as the seeded account, so the files show fiction only.

import { mkdirSync } from "node:fs";
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
  viewport: { width: 1680, height: 1050 },
  deviceScaleFactor: 2,
};
/** The week grid keeps a minimum column width: five days need the extra room. */
const WIDE = {
  viewport: { width: 1920, height: 1200 },
  deviceScaleFactor: 2,
};
const PHONE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

/** @type {Array<{ file: string, path: string, theme: "light" | "dark", device?: typeof PHONE | typeof WIDE }>} */
const SHOTS = [
  { file: "week-light.png", path: "/week", theme: "light", device: WIDE },
  { file: "cra-light.png", path: "/cra", theme: "light" },
  { file: "invoices-light.png", path: "/invoices", theme: "light" },
  { file: "revenue-light.png", path: "/revenue", theme: "light" },
  { file: "expenses-light.png", path: "/expenses", theme: "light" },
  { file: "declarations-light.png", path: "/declarations", theme: "light" },
  { file: "bank-light.png", path: "/bank-account", theme: "light" },
  { file: "deadlines-light.png", path: "/deadlines", theme: "light" },
  { file: "week-phone.png", path: "/week", theme: "light", device: PHONE },
  { file: "treasury-dark.png", path: "/treasury", theme: "dark" },
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

/**
 * The theme is an account setting; the API answers with the cookie the SPA
 * boots from. Sent from inside the page, so the request carries the origin
 * Sanctum expects along with the session and XSRF cookies.
 */
async function setTheme(page, theme) {
  const status = await page.evaluate(async (value) => {
    const xsrf = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("XSRF-TOKEN="))
      ?.slice("XSRF-TOKEN=".length);
    const response = await fetch("/api/user/theme", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(xsrf ?? ""),
      },
      body: JSON.stringify({ theme: value }),
    });

    return response.status;
  }, THEME[theme]);

  if (status !== 200) {
    throw new Error(`PUT /api/user/theme answered ${status}`);
  }
}

/** One sign-in for the whole run: the login route is rate-limited per visitor. */
async function signedInState(browser) {
  const context = await browser.newContext(DESKTOP);
  const page = await context.newPage();
  await signIn(page);
  const state = await context.storageState();
  await context.close();

  return state;
}

async function capture(browser, shot, storageState, themeChanged) {
  const context = await browser.newContext({
    ...(shot.device ?? DESKTOP),
    locale: "fr-FR",
    colorScheme: shot.theme,
    storageState,
  });
  const page = await context.newPage();

  // The theme route is rate-limited too: asked only when a shot changes it.
  if (themeChanged) {
    await page.goto(`${BASE_URL}/week`);
    await setTheme(page, shot.theme);
  }

  await page.goto(`${BASE_URL}${shot.path}`);
  await page.waitForLoadState("networkidle");
  // The dev stack mounts the TanStack devtools trigger beside the app root.
  await page.addStyleTag({
    content: "body > :not(#app) { display: none !important; }",
  });
  // Charts and counters animate in; a short settle keeps them off mid-frame.
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT_DIR, shot.file) });
  await context.close();

  console.log(`${shot.file} ← ${shot.path} (${shot.theme})`);
}

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch();

try {
  const storageState = await signedInState(browser);
  let theme = null;

  for (const shot of SHOTS) {
    await capture(browser, shot, storageState, shot.theme !== theme);
    theme = shot.theme;
  }
} finally {
  await browser.close();
}
