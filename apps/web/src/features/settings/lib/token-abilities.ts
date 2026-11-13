import type { TokenAbility } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

const TOKEN_ABILITY_LABELS: Record<TokenAbility, () => string> = {
  "invoices:read": () => m.security_token_ability_invoices_read(),
  "missions:read": () => m.security_token_ability_missions_read(),
  "treasury:read": () => m.security_token_ability_treasury_read(),
  "declarations:read": () => m.security_token_ability_declarations_read(),
};

/** Every ability, in the order the creation dialog offers them. */
export const TOKEN_ABILITIES = Object.keys(
  TOKEN_ABILITY_LABELS,
) as TokenAbility[];

export function tokenAbilityLabel(ability: TokenAbility): string {
  return TOKEN_ABILITY_LABELS[ability]();
}
