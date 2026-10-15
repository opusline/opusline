/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Breakdown_AriaInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Répartition du solde du compte pro")
	return /** @type {LocalizedString} */ ("Breakdown of the business account balance")
});