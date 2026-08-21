/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ share: NonNullable<unknown> }} Missions_Budget_Warning_TitleInputs */

const en_missions_budget_warning_title = /** @type {(inputs: Missions_Budget_Warning_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fixed price ${i?.share} % consumed`)
};

const fr_missions_budget_warning_title = /** @type {(inputs: Missions_Budget_Warning_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Forfait consommé à ${i?.share} %`)
};

/**
* | output |
* | --- |
* | "Fixed price {share} % consumed" |
*
* @param {Missions_Budget_Warning_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_warning_title = /** @type {((inputs: Missions_Budget_Warning_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_Warning_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_warning_title(inputs)
	return en_missions_budget_warning_title(inputs)
});