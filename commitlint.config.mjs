export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
    // The subject alone, not the header: config-conventional's
    // header-max-length also counts `refactor(storybook): `, so the same budget
    // would buy a long scope a short summary. pr-title.yml lints the PR title
    // through this config, so it is the same 50 characters on both doors.
    "subject-max-length": [2, "always", 50],
    "scope-enum": [
      2,
      "always",
      ["api", "web", "ui", "storybook", "deps", "repo"],
    ],
  },
};
