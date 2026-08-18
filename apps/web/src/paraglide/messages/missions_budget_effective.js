/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Budget_EffectiveInputs */

const en_missions_budget_effective = /** @type {(inputs: Missions_Budget_EffectiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Effective rate`)
};

const fr_missions_budget_effective = /** @type {(inputs: Missions_Budget_EffectiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TJM réel`)
};

/**
* | output |
* | --- |
* | "Effective rate" |
*
* @param {Missions_Budget_EffectiveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_effective = /** @type {((inputs?: Missions_Budget_EffectiveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_EffectiveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_effective(inputs)
	return en_missions_budget_effective(inputs)
});