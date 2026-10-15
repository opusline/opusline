/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Trend_None_YearInputs */



/**
* | output |
* | --- |
* | "Nothing comparable in the previous year" |
*
* @param {Revenue_Trend_None_YearInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_trend_none_year = /** @type {((inputs?: Revenue_Trend_None_YearInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Trend_None_YearInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Rien de comparable sur l'année précédente")
	return /** @type {LocalizedString} */ ("Nothing comparable in the previous year")
});