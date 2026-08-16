import { client as apiClient } from "@opusline/api-client/client";
import { fileRejector } from "@/lib/files";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const LOGO_ACCEPT = ".png,.svg";
export const MAX_LOGO_BYTES = 2048 * 1024;

export type LogoUploadResult =
  | { status: "success" }
  | { status: "failed"; message: string };

export const rejectLogoReason = fileRejector({
  accept: LOGO_ACCEPT,
  maxBytes: MAX_LOGO_BYTES,
  rejectType: m.logo_reject_type,
  rejectSize: m.logo_reject_size,
});

export function clientLogoHref(clientSlug: string, version = 0): string {
  const url = apiClient.buildUrl({
    url: "/clients/{client}/logo",
    path: { client: clientSlug },
  });

  return version === 0 ? url : `${url}?v=${version}`;
}

function uploadFailureMessage(error: unknown): string {
  return serverFieldErrors(error)?.logo?.message ?? m.common_upload_failed();
}

type LogoHandlerOptions = {
  upload: (logo: File) => Promise<unknown>;
  remove: () => Promise<unknown>;
  invalidate: () => Promise<void>;
};

export function logoHandlers({
  upload,
  remove,
  invalidate,
}: LogoHandlerOptions) {
  return {
    handleUpload: async (logo: File): Promise<LogoUploadResult> => {
      try {
        await upload(logo);
        await invalidate();
        return { status: "success" };
      } catch (error) {
        return { status: "failed", message: uploadFailureMessage(error) };
      }
    },
    handleRemove: async (): Promise<boolean> => {
      try {
        await remove();
        await invalidate();
        return true;
      } catch {
        return false;
      }
    },
  };
}
