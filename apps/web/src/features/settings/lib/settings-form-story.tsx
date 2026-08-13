import type { SettingsData } from "@opusline/api-client";
import type { ReactNode } from "react";

import { type SettingsForm, useSettingsForm } from "./use-settings-form";

type SettingsFormStoryProps = {
  settings: SettingsData;
  children: (form: SettingsForm) => ReactNode;
};

export function SettingsFormStory({
  settings,
  children,
}: SettingsFormStoryProps) {
  const form = useSettingsForm(settings, async () => ({
    status: "success" as const,
  }));

  return <div className="max-w-160">{children(form)}</div>;
}
