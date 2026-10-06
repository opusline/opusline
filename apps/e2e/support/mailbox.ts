import { type APIRequestContext, expect } from "@playwright/test";

const MAILPIT_URL = process.env.E2E_MAILPIT_URL ?? "http://localhost:8026";
const RESET_LINK = /https?:\/\/[^\s\])]+\/reset-password\?[^\s\])]+/;

async function messageIdsFor(
  request: APIRequestContext,
  address: string,
): Promise<string[]> {
  const search = await request.get(`${MAILPIT_URL}/api/v1/search`, {
    params: { query: `to:"${address}"` },
  });
  const { messages } = (await search.json()) as { messages: { ID: string }[] };

  return messages.map(({ ID }) => ID);
}

/** How many emails the stack has delivered to an address so far. */
export async function emailCountFor(
  request: APIRequestContext,
  address: string,
): Promise<number> {
  return (await messageIdsFor(request, address)).length;
}

/** The text of every email the stack has sent to an address so far. */
async function emailsSentTo(
  request: APIRequestContext,
  address: string,
): Promise<string[]> {
  return Promise.all(
    (await messageIdsFor(request, address)).map(async (ID) => {
      const message = await request.get(`${MAILPIT_URL}/api/v1/message/${ID}`);

      return ((await message.json()) as { Text: string }).Text;
    }),
  );
}

/**
 * Where the reset email sent to an address points, as a path: the link is
 * built on the stack's own APP_URL, and the suite browses E2E_BASE_URL.
 *
 * Polls for the link rather than for any email: the queue worker sends after
 * the request has answered, and the same account may be owed other mail.
 */
export async function resetPathEmailedTo(
  request: APIRequestContext,
  address: string,
): Promise<string> {
  let link: string | undefined;

  await expect
    .poll(
      async () => {
        const emails = await emailsSentTo(request, address);

        link = emails
          .map((text) => text.match(RESET_LINK)?.[0])
          .find((match) => match !== undefined);

        return link;
      },
      { timeout: 30_000 },
    )
    .toBeDefined();

  if (link === undefined) {
    throw new Error(`No reset link was emailed to ${address}`);
  }

  const { pathname, search } = new URL(link);

  return `${pathname}${search}`;
}
