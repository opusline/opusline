/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Budget_TitleInputs */

const en_missions_budget_title = /** @type {(inputs: Missions_Budget_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Effort`)
};

const fr_missions_budget_title = /** @type {(inputs: Missions_Budget_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Charge`)
};

/**
* | output |
* | --- |
* | "Effort" |
*
* @param {Missions_Budget_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_title = /** @type {((inputs?: Missions_Budget_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_title(inputs)
	return en_missions_budget_title(inputs)
});