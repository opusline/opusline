import type { APIResponse, BrowserContext } from "@playwright/test";

export type Api = {
  post: <ResponseBody>(path: string, body: unknown) => Promise<ResponseBody>;
  /** The raw response, for files the app serves: status, headers and bytes. */
  download: (url: string) => Promise<APIResponse>;
};

const CSRF_COOKIE = "XSRF-TOKEN";

/**
 * Talks to the API as the SPA does, over the browser context's own cookie jar:
 * whatever session a call opens is the session the page then browses with.
 */
export function createApi(context: BrowserContext, baseURL: string): Api {
  const origin = new URL(baseURL).origin;

  // Sanctum only treats a request as the SPA's when it names its origin, and
  // unlike a browser this client sends neither header by itself.
  const spaHeaders = {
    Accept: "application/json",
    "Accept-Language": "en",
    Origin: origin,
    Referer: `${origin}/`,
  };

  async function csrfToken(): Promise<string> {
    const readToken = async () =>
      (await context.cookies(origin)).find(({ name }) => name === CSRF_COOKIE)
        ?.value;

    if ((await readToken()) === undefined) {
      await context.request.get(`${origin}/sanctum/csrf-cookie`);
    }

    const token = await readToken();

    if (token === undefined) {
      throw new Error(
        `${origin}/sanctum/csrf-cookie set no ${CSRF_COOKIE} cookie`,
      );
    }

    return decodeURIComponent(token);
  }

  return {
    async post<ResponseBody>(path: string, body: unknown) {
      const response = await context.request.post(`${origin}${path}`, {
        data: body,
        headers: { ...spaHeaders, "X-XSRF-TOKEN": await csrfToken() },
      });

      if (response.status() === 429) {
        throw new Error(
          `POST ${path} was throttled. Every test browses as its own visitor through X-Forwarded-For, which the production stack's Caddy honours; against turbo dev, Laravel only does with TRUSTED_PROXIES=* in apps/api/.env.`,
        );
      }

      if (!response.ok()) {
        throw new Error(
          `POST ${path} answered ${response.status()}: ${await response.text()}`,
        );
      }

      return (await response.json()) as ResponseBody;
    },

    download(url: string) {
      return context.request.get(new URL(url, origin).href, {
        headers: { ...spaHeaders, Accept: "*/*" },
      });
    },
  };
}
