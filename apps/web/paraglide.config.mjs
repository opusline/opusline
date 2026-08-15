/** @type {import("@inlang/paraglide-js").CompilerOptions} */
export const paraglideCompilerOptions = {
  project: "./project.inlang",
  outdir: "./src/paraglide",
  outputStructure: "message-modules",
  cookieName: "opusline_locale",
  strategy: ["cookie", "preferredLanguage", "baseLocale"],
  emitGitIgnore: false,
  emitPrettierIgnore: false,
};
