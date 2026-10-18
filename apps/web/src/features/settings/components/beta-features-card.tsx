import type { BetaFeatureData, FeatureFlag } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Switch } from "@opusline/ui/components/switch";
import { useId } from "react";

import { m } from "@/paraglide/messages.js";

import { SettingsSection } from "./settings-section";

const FEATURE_COPY: Record<
  FeatureFlag,
  { title: () => string; description: () => string }
> = {
  0: {
    title: m.beta_feature_invoicing_title,
    description: m.beta_feature_invoicing_description,
  },
};

type BetaFeaturesCardProps = {
  /** What this instance offers in beta; the ones it forces on or off are not listed. */
  features: BetaFeatureData[];
  isSaving: boolean;
  error: string | null;
  onChange: (key: string, active: boolean) => void;
};

export function BetaFeaturesCard({
  features,
  isSaving,
  error,
  onChange,
}: BetaFeaturesCardProps) {
  return (
    <SettingsSection description={m.beta_description()} title={m.beta_title()}>
      {features.length === 0 ? (
        <p className="text-muted-foreground-3 text-sm" data-testid="beta-empty">
          {m.beta_empty()}
        </p>
      ) : (
        <ul className="flex flex-col divide-y">
          {features.map((feature) => (
            <BetaFeatureRow
              feature={feature}
              isSaving={isSaving}
              key={feature.key}
              onChange={(active) => onChange(feature.key, active)}
            />
          ))}
        </ul>
      )}
      {error === null ? null : (
        <p className="mt-3 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </SettingsSection>
  );
}

function BetaFeatureRow({
  feature,
  isSaving,
  onChange,
}: {
  feature: BetaFeatureData;
  isSaving: boolean;
  onChange: (active: boolean) => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const copy = FEATURE_COPY[feature.feature];

  return (
    <li className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-foreground-hi text-sm" id={titleId}>
            {copy.title()}
          </span>
          <Badge variant="brand">{m.beta_badge()}</Badge>
        </div>
        <p className="mt-1 text-muted-foreground-3 text-sm" id={descriptionId}>
          {copy.description()}
        </p>
      </div>
      <Switch
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        checked={feature.active}
        data-active={feature.active}
        data-feature={feature.key}
        data-testid="beta-feature-switch"
        disabled={isSaving}
        onCheckedChange={onChange}
      />
    </li>
  );
}
