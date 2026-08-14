export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
    "scope-enum": [
      2,
      "always",
      ["api", "web", "ui", "storybook", "deps", "repo"],
    ],
  },
};
