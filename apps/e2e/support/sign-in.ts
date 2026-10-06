import type { Page } from "@playwright/test";

/** Fills and submits the login form the page is already showing. */
export async function signIn(page: Page, email: string, password: string) {
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
}
