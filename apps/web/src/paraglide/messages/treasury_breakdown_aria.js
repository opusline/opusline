/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Breakdown_AriaInputs */

const en_treasury_breakdown_aria = /** @type {(inputs: Treasury_Breakdown_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Breakdown of the business account balance`)
};

const fr_treasury_breakdown_aria = /** @type {(inputs: Treasury_Breakdown_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Répartition du solde du compte pro`)
};

/**
* | output |
* | --- |
* | "Breakdown of the business account balance" |
*
* @param {Treasury_Breakdown_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_breakdown_aria = /** @type {((inputs?: Treasury_Breakdown_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Breakdown_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_breakdown_aria(inputs)
	return en_treasury_breakdown_aria(inputs)
});