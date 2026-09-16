import { ext } from "./ext";

export const BANNER_TAG = "opusline-handoff";

type BannerOptions = {
  title: string;
  filled: string[];
  skipped: string[];
};

const STYLES = `
:host { all: initial; position: fixed; top: 16px; right: 16px; z-index: 2147483647; }
.banner { box-sizing: border-box; width: 340px; max-width: calc(100vw - 32px); padding: 14px 16px; border-radius: 8px;
  background: #1c1917; color: #fafaf9; font: 14px/1.45 system-ui, sans-serif; box-shadow: 0 8px 24px rgba(0, 0, 0, .35); }
.title { margin: 0 0 8px; font-weight: 600; color: #e6a23c; }
.list { margin: 0 0 6px; }
.review { margin: 8px 0 12px; color: #d6d3d1; }
.dismiss { font: inherit; padding: 6px 12px; border: 1px solid #57534e; border-radius: 6px; background: transparent; color: inherit; cursor: pointer; }
.dismiss:hover { background: #292524; }
.dismiss:focus-visible { outline: 2px solid #e6a23c; outline-offset: 2px; }
`;

/**
 * Shows what was and was not filled, in a closed shadow root so the portal's
 * stylesheets cannot reach it. Built node by node: a portal enforcing Trusted
 * Types would throw on `innerHTML`.
 */
export function showBanner(doc: Document, options: BannerOptions): void {
  doc.querySelector(BANNER_TAG)?.remove();

  const host = doc.createElement(BANNER_TAG);
  const root = host.attachShadow({ mode: "closed" });
  const style = doc.createElement("style");
  style.textContent = STYLES;

  const banner = doc.createElement("section");
  banner.className = "banner";
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");

  const title = doc.createElement("h2");
  title.className = "title";
  title.textContent = options.title;
  banner.append(title);

  if (options.filled.length > 0) {
    banner.append(
      paragraph(
        doc,
        "list",
        ext.i18n.getMessage("banner_filled", [options.filled.join(", ")]),
      ),
    );
  }
  if (options.skipped.length > 0) {
    banner.append(
      paragraph(
        doc,
        "list",
        ext.i18n.getMessage("banner_skipped", [options.skipped.join(", ")]),
      ),
    );
  }
  banner.append(paragraph(doc, "review", ext.i18n.getMessage("banner_review")));

  const dismiss = doc.createElement("button");
  dismiss.type = "button";
  dismiss.className = "dismiss";
  dismiss.textContent = ext.i18n.getMessage("banner_dismiss");
  dismiss.addEventListener("click", () => host.remove());
  banner.append(dismiss);

  root.append(style, banner);
  doc.documentElement.append(host);
  dismiss.focus();
}

function paragraph(
  doc: Document,
  className: string,
  text: string,
): HTMLParagraphElement {
  const element = doc.createElement("p");
  element.className = className;
  element.textContent = text;

  return element;
}
