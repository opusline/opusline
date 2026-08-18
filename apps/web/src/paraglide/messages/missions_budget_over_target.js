/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Missions_Budget_Over_TargetInputs */

const en_missions_budget_over_target = /** @type {(inputs: Missions_Budget_Over_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`above your ${i?.rate} target`)
};

const fr_missions_budget_over_target = /** @type {(inputs: Missions_Budget_Over_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`au-dessus de votre cible de ${i?.rate}`)
};

/**
* | output |
* | --- |
* | "above your {rate} target" |
*
* @param {Missions_Budget_Over_TargetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_over_target = /** @type {((inputs: Missions_Budget_Over_TargetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_Over_TargetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_over_target(inputs)
	return en_missions_budget_over_target(inputs)
});