import { afterEach, expect, it, vi } from "vitest";

import { uploadWithProgress } from "./upload-with-progress";

type Opened = { method: string; url: string };

/** Stands in for the browser's XHR, and hands back the levers to drive it. */
function stubXhr() {
  const opened: Opened[] = [];
  const headers: Record<string, string> = {};
  const bodies: FormData[] = [];
  const uploadListeners = new Map<string, (event: ProgressEvent) => void>();
  const listeners = new Map<string, () => void>();
  let live: { status: number; responseText: string } | null = null;

  class FakeXhr {
    status = 200;
    responseText = "{}";
    withCredentials = false;
    upload = {
      addEventListener: (
        name: string,
        handler: (event: ProgressEvent) => void,
      ) => uploadListeners.set(name, handler),
    };

    open(method: string, url: string) {
      opened.push({ method, url });
    }

    setRequestHeader(name: string, value: string) {
      headers[name] = value;
    }

    addEventListener(name: string, handler: () => void) {
      listeners.set(name, handler);
    }

    send(body: FormData) {
      bodies.push(body);
      live = this;
    }
  }

  vi.stubGlobal("XMLHttpRequest", FakeXhr);
  // The helper asks for a CSRF cookie before it opens the request; a tab that has
  // only ever read does not have one yet.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 204 })),
  );

  return {
    opened,
    headers,
    bodies,
    sendProgress: (loaded: number, total: number) =>
      uploadListeners.get("progress")?.({
        lengthComputable: true,
        loaded,
        total,
      } as ProgressEvent),
    sendUploaded: () => uploadListeners.get("load")?.({} as ProgressEvent),
    respond: (status: number, body: unknown) => {
      if (live !== null) {
        live.status = status;
        live.responseText = JSON.stringify(body);
      }

      listeners.get("load")?.();
    },
    fail: () => listeners.get("error")?.(),
  };
}

function upload(onProgress: (progress: { percent: number | null }) => void) {
  return uploadWithProgress({
    url: "/invoices/{invoice}/document",
    path: { invoice: 7 },
    field: "file",
    file: new File(["%PDF-1.4"], "facture.pdf", { type: "application/pdf" }),
    onProgress,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("posts the file to the path the SDK names", async () => {
  const xhr = stubXhr();
  const pending = upload(() => undefined);

  await vi.waitFor(() => expect(xhr.opened).toHaveLength(1));

  expect(xhr.opened[0].method).toBe("POST");
  expect(xhr.opened[0].url).toContain("/invoices/7/document");
  expect((xhr.bodies[0].get("file") as File).name).toBe("facture.pdf");

  xhr.respond(201, { filed: true });
  await expect(pending).resolves.toEqual({ filed: true });
});

it("reports how much has left the machine", async () => {
  const xhr = stubXhr();
  const seen: (number | null)[] = [];
  const pending = upload(({ percent }) => seen.push(percent));

  await vi.waitFor(() => expect(xhr.opened).toHaveLength(1));

  xhr.sendProgress(1, 4);
  xhr.sendProgress(4, 4);

  expect(seen).toEqual([25, 100]);

  xhr.respond(201, {});
  await pending;
});

it("stops reporting a figure once the bytes are gone and the API has not answered", async () => {
  const xhr = stubXhr();
  const seen: (number | null)[] = [];
  const pending = upload(({ percent }) => seen.push(percent));

  await vi.waitFor(() => expect(xhr.opened).toHaveLength(1));

  xhr.sendProgress(4, 4);
  xhr.sendUploaded();

  expect(seen).toEqual([100, null]);

  xhr.respond(201, {});
  await pending;
});

it("rejects with the status, so a 422 still reads as field errors", async () => {
  const xhr = stubXhr();
  const pending = upload(() => undefined);

  await vi.waitFor(() => expect(xhr.opened).toHaveLength(1));

  xhr.respond(422, { errors: { file: ["Le fichier est trop lourd."] } });

  await expect(pending).rejects.toMatchObject({
    status: 422,
    errors: { file: ["Le fichier est trop lourd."] },
  });
});

it("rejects a connection that never arrived", async () => {
  const xhr = stubXhr();
  const pending = upload(() => undefined);

  await vi.waitFor(() => expect(xhr.opened).toHaveLength(1));

  xhr.fail();

  await expect(pending).rejects.toThrow(TypeError);
});
