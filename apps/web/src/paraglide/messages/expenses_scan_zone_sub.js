/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Zone_SubInputs */



/**
* | output |
* | --- |
* | "PDF · supplier, date, amounts and TVA are read for you" |
*
* @param {Expenses_Scan_Zone_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_zone_sub = /** @type {((inputs?: Expenses_Scan_Zone_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Zone_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("PDF · fournisseur, date, montants et TVA sont lus automatiquement")
	return /** @type {LocalizedString} */ ("PDF · supplier, date, amounts and TVA are read for you")
});