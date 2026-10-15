/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Skin_Billed_DayInputs */



/**
* | output |
* | --- |
* | "Day billed at the TJM" |
*
* @param {Week_Skin_Billed_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_skin_billed_day = /** @type {((inputs?: Week_Skin_Billed_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Skin_Billed_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Jour facturé au TJM")
	return /** @type {LocalizedString} */ ("Day billed at the TJM")
});