/** @type {import("@inlang/paraglide-js").CompilerOptions} */
export const paraglideCompilerOptions = {
  project: "./project.inlang",
  outdir: "./src/paraglide",
  outputStructure: "message-modules",
  cookieName: "opusline_locale",
  strategy: ["cookie", "preferredLanguage", "baseLocale"],
  // The Vite plugin injects this per-bundler; the CLI defaults to a plain
  // window check. Pinning it keeps both compilers byte-identical.
  isServer: "import.meta.env?.SSR ?? typeof window === 'undefined'",
  emitGitIgnore: false,
  emitPrettierIgnore: false,
};
