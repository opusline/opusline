import { randomInt } from "node:crypto";
import { test as base } from "@playwright/test";
import { type Api, createApi } from "./api";
import { type Account, registerAccount } from "./provision";

type Fixtures = {
  api: Api;
  account: Account;
};

/**
 * The register and login limiters count per client address, and the whole suite
 * reaches the stack from one. 198.18.0.0/15 is reserved for benchmarking, so it
 * is no real visitor's address and sits outside the private ranges Caddy would
 * refuse to take from X-Forwarded-For.
 */
function randomVisitorAddress(): string {
  return `198.${18 + randomInt(2)}.${randomInt(256)}.${1 + randomInt(254)}`;
}

export const test = base.extend<Fixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Playwright reads a fixture's dependencies off this destructuring pattern and rejects any other first parameter.
  extraHTTPHeaders: async ({}, provide) => {
    await provide({ "X-Forwarded-For": randomVisitorAddress() });
  },

  api: async ({ context, baseURL }, provide) => {
    if (baseURL === undefined) {
      throw new Error("playwright.config.ts defines no baseURL");
    }

    await provide(createApi(context, baseURL));
  },

  account: async ({ api }, provide) => {
    await provide(await registerAccount(api));
  },
});

export { expect } from "@playwright/test";
