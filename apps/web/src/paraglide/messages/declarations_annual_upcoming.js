/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Annual_UpcomingInputs */

const en_declarations_annual_upcoming = /** @type {(inputs: Declarations_Annual_UpcomingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Upcoming`)
};

const fr_declarations_annual_upcoming = /** @type {(inputs: Declarations_Annual_UpcomingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À venir`)
};

/**
* | output |
* | --- |
* | "Upcoming" |
*
* @param {Declarations_Annual_UpcomingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_upcoming = /** @type {((inputs?: Declarations_Annual_UpcomingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_UpcomingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_upcoming(inputs)
	return en_declarations_annual_upcoming(inputs)
});