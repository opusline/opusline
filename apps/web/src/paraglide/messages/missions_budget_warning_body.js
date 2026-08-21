/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ tracked: NonNullable<unknown>, covered: NonNullable<unknown>, remaining: NonNullable<unknown> }} Missions_Budget_Warning_BodyInputs */

const en_missions_budget_warning_body = /** @type {(inputs: Missions_Budget_Warning_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tracked} tracked out of the ${i?.covered} the fixed price covers. ${i?.remaining} left before you reach it.`)
};

const fr_missions_budget_warning_body = /** @type {(inputs: Missions_Budget_Warning_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tracked} saisis sur les ${i?.covered} que couvre le forfait. Il reste ${i?.remaining} avant d'y être.`)
};

/**
* | output |
* | --- |
* | "{tracked} tracked out of the {covered} the fixed price covers. {remaining} left before you reach it." |
*
* @param {Missions_Budget_Warning_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_warning_body = /** @type {((inputs: Missions_Budget_Warning_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_Warning_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_warning_body(inputs)
	return en_missions_budget_warning_body(inputs)
});