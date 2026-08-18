/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Budget_No_TargetInputs */

const en_missions_budget_no_target = /** @type {(inputs: Missions_Budget_No_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set a target day rate to read this fixed price as a number of days.`)
};

const fr_missions_budget_no_target = /** @type {(inputs: Missions_Budget_No_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Renseignez un TJM cible pour lire ce forfait en nombre de jours.`)
};

/**
* | output |
* | --- |
* | "Set a target day rate to read this fixed price as a number of days." |
*
* @param {Missions_Budget_No_TargetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_no_target = /** @type {((inputs?: Missions_Budget_No_TargetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_No_TargetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_no_target(inputs)
	return en_missions_budget_no_target(inputs)
});