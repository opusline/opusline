/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Budget_OverInputs */

const en_missions_budget_over = /** @type {(inputs: Missions_Budget_OverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`over budget`)
};

const fr_missions_budget_over = /** @type {(inputs: Missions_Budget_OverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`budget dépassé`)
};

/**
* | output |
* | --- |
* | "over budget" |
*
* @param {Missions_Budget_OverInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_over = /** @type {((inputs?: Missions_Budget_OverInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_OverInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_over(inputs)
	return en_missions_budget_over(inputs)
});