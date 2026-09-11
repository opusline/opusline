import { client as apiClient } from "@opusline/api-client/client";

import { readCookie } from "./cookies";
import { apiLocaleFor, currentUiLocale } from "./i18n";

/**
 * Post a file and watch it go.
 *
 * The generated client is `fetch`, which reports nothing until the whole body is
 * gone — fine for a form, useless for the 20 MB a scanned invoice can be. This is
 * the one call that uses XMLHttpRequest instead, because `upload.onprogress` is
 * still the only way a browser will tell you how much has left the machine.
 *
 * It borrows everything else from the client rather than restating it: the URL is
 * built from the same path template the SDK uses, and the session rides on the
 * same cookies, so nothing here is a second definition of the API.
 */
export type UploadProgress = {
  /** Bytes sent as a percentage, or null while the length is unknown. */
  percent: number | null;
};

export type UploadWithProgressOptions = {
  /** The SDK's path template, e.g. `/invoices/{invoice}/document`. */
  url: string;
  path: Record<string, number | string>;
  /** The multipart field the API reads the file from. */
  field: string;
  file: File;
  onProgress: (progress: UploadProgress) => void;
  signal?: AbortSignal;
};

export async function uploadWithProgress({
  url,
  path,
  field,
  file,
  onProgress,
  signal,
}: UploadWithProgressOptions): Promise<unknown> {
  // The session cookie is only handed out once; a first upload in a fresh tab
  // would otherwise be the request that trips the 419.
  if (readCookie("XSRF-TOKEN") === null) {
    await fetch("/sanctum/csrf-cookie", {
      headers: { Accept: "application/json" },
    });
  }

  const body = new FormData();
  body.append(field, file);

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("POST", apiClient.buildUrl({ url, path }));
    request.withCredentials = true;
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader(
      "Accept-Language",
      apiLocaleFor(currentUiLocale()),
    );

    const token = readCookie("XSRF-TOKEN");
    if (token !== null) {
      request.setRequestHeader("X-XSRF-TOKEN", token);
    }

    request.upload.addEventListener("progress", (event) => {
      onProgress({
        percent: event.lengthComputable
          ? Math.round((event.loaded / event.total) * 100)
          : null,
      });
    });

    // The last byte is not the end of the story: the API still has to store the
    // file. Reporting null here is what keeps the bar from sitting at 100 % while
    // the request is still open.
    request.upload.addEventListener("load", () =>
      onProgress({ percent: null }),
    );

    request.addEventListener("load", () => {
      const parsed = parseBody(request.responseText);

      if (request.status >= 200 && request.status < 300) {
        resolve(parsed);
        return;
      }

      reject(
        typeof parsed === "object" && parsed !== null
          ? { ...parsed, status: request.status }
          : { status: request.status },
      );
    });

    request.addEventListener("error", () => reject({ status: 0 }));
    request.addEventListener("abort", () => reject({ status: 0 }));

    signal?.addEventListener("abort", () => request.abort(), { once: true });

    request.send(body);
  });
}

/** A proxy's HTML error page is not a field map; it falls through as null. */
function parseBody(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
