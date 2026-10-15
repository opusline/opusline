/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Annual_Upcoming_LowerInputs */



/**
* | output |
* | --- |
* | "upcoming" |
*
* @param {Declarations_Annual_Upcoming_LowerInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_upcoming_lower = /** @type {((inputs?: Declarations_Annual_Upcoming_LowerInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_Upcoming_LowerInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("à venir")
	return /** @type {LocalizedString} */ ("upcoming")
});