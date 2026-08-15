import type { Preview } from "@storybook/react";

import "../src/preview.css";
import { withThemeByClassName } from "@storybook/addon-themes";
import { themes } from "storybook/theming";
import { overwriteGetLocale } from "../../web/src/paraglide/runtime.js";

const preview: Preview = {
  parameters: {
    docs: { theme: themes.dark },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
    },
  },
  globalTypes: {
    locale: {
      description: "UI language",
      toolbar: {
        icon: "globe",
        items: [
          { value: "fr", title: "Français" },
          { value: "en", title: "English" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: "fr" },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
    (Story, context) => {
      overwriteGetLocale(() => (context.globals.locale === "en" ? "en" : "fr"));

      return Story();
    },
  ],
};

export default preview;
