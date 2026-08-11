import { client as apiClient } from "@opusline/api-client/client";

export function signatureHref(version = 0): string {
  const url = apiClient.buildUrl({ url: "/user/signature" });

  return version === 0 ? url : `${url}?v=${version}`;
}
