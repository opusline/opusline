import { client as apiClient } from "@opusline/api-client/client";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const LOGO_ACCEPT = ".png,.svg";
export const MAX_LOGO_BYTES = 2048 * 1024;

const ACCEPTED_EXTENSIONS = new Set(
  LOGO_ACCEPT.split(",").map((extension) => extension.slice(1)),
);

export type LogoUploadResult =
  | { status: "success" }
  | { status: "failed"; message: string };

export function rejectLogoReason(file: File): string | null {
  const extension = file.name.toLowerCase().split(".").pop() ?? "";

  if (!ACCEPTED_EXTENSIONS.has(extension)) {
    return "PNG ou SVG uniquement";
  }

  if (file.size > MAX_LOGO_BYTES) {
    return "trop lourd (max 2 Mo)";
  }

  return null;
}

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
