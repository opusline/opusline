import { client as apiClient } from "@opusline/api-client/client";
import { fileRejector } from "@/lib/files";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const MAX_LOGO_BYTES = 2048 * 1024;

export type LogoUploadResult =
  | { status: "success" }
  | { status: "failed"; message: string };

/** What one logo slot takes: its extensions and the reason a file is refused. */
export type LogoRules = {
  accept: string;
  reject: (file: File) => string | null;
};

const CLIENT_LOGO_ACCEPT = ".png,.svg";

export const CLIENT_LOGO_RULES: LogoRules = {
  accept: CLIENT_LOGO_ACCEPT,
  reject: fileRejector({
    accept: CLIENT_LOGO_ACCEPT,
    maxBytes: MAX_LOGO_BYTES,
    rejectType: m.logo_reject_type,
    rejectSize: m.logo_reject_size,
  }),
};

/** The account's own logo also prints on PDFs, where a photo-style JPG is common. */
const COMPANY_LOGO_ACCEPT = ".png,.jpg,.jpeg,.svg";

export const COMPANY_LOGO_RULES: LogoRules = {
  accept: COMPANY_LOGO_ACCEPT,
  reject: fileRejector({
    accept: COMPANY_LOGO_ACCEPT,
    maxBytes: 1536 * 1024,
    rejectType: m.settings_logo_reject_type,
    rejectSize: m.settings_logo_reject_size,
  }),
};

export function companyLogoHref(version = 0): string {
  const url = apiClient.buildUrl({ url: "/user/logo" });

  return version === 0 ? url : `${url}?v=${version}`;
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
