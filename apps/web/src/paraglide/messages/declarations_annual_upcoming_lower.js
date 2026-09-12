/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Annual_Upcoming_LowerInputs */

const en_declarations_annual_upcoming_lower = /** @type {(inputs: Declarations_Annual_Upcoming_LowerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`upcoming`)
};

const fr_declarations_annual_upcoming_lower = /** @type {(inputs: Declarations_Annual_Upcoming_LowerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`à venir`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_upcoming_lower(inputs)
	return en_declarations_annual_upcoming_lower(inputs)
});