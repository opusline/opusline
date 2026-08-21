/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ tracked: NonNullable<unknown>, covered: NonNullable<unknown> }} Missions_Budget_Share_TitleInputs */

const en_missions_budget_share_title = /** @type {(inputs: Missions_Budget_Share_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tracked} tracked out of the ${i?.covered} the fixed price covers`)
};

const fr_missions_budget_share_title = /** @type {(inputs: Missions_Budget_Share_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tracked} saisis sur les ${i?.covered} que couvre le forfait`)
};

/**
* | output |
* | --- |
* | "{tracked} tracked out of the {covered} the fixed price covers" |
*
* @param {Missions_Budget_Share_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_share_title = /** @type {((inputs: Missions_Budget_Share_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_Share_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_share_title(inputs)
	return en_missions_budget_share_title(inputs)
});