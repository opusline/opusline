/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Missions_Budget_Exceeded_TitleInputs */

const en_missions_budget_exceeded_title = /** @type {(inputs: Missions_Budget_Exceeded_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fixed price overrun by ${i?.amount}`)
};

const fr_missions_budget_exceeded_title = /** @type {(inputs: Missions_Budget_Exceeded_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Forfait dépassé de ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "Fixed price overrun by {amount}" |
*
* @param {Missions_Budget_Exceeded_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_exceeded_title = /** @type {((inputs: Missions_Budget_Exceeded_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_Exceeded_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_exceeded_title(inputs)
	return en_missions_budget_exceeded_title(inputs)
});