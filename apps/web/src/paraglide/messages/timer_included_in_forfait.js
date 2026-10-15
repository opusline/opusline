/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Included_In_ForfaitInputs */



/**
* | output |
* | --- |
* | "included in the fixed price" |
*
* @param {Timer_Included_In_ForfaitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_included_in_forfait = /** @type {((inputs?: Timer_Included_In_ForfaitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Included_In_ForfaitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("compris dans le forfait")
	return /** @type {LocalizedString} */ ("included in the fixed price")
});