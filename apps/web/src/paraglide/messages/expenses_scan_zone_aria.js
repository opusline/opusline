/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Zone_AriaInputs */

const en_expenses_scan_zone_aria = /** @type {(inputs: Expenses_Scan_Zone_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read the receipt`)
};

const fr_expenses_scan_zone_aria = /** @type {(inputs: Expenses_Scan_Zone_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire la facture`)
};

/**
* | output |
* | --- |
* | "Read the receipt" |
*
* @param {Expenses_Scan_Zone_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_zone_aria = /** @type {((inputs?: Expenses_Scan_Zone_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Zone_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_zone_aria(inputs)
	return en_expenses_scan_zone_aria(inputs)
});