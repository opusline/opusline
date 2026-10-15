/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Hint_ManualInputs */



/**
* | output |
* | --- |
* | "The receipt stays attached; fill the fields by hand. Photos are not read yet." |
*
* @param {Expenses_Scan_Hint_ManualInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_hint_manual = /** @type {((inputs?: Expenses_Scan_Hint_ManualInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Hint_ManualInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("La facture reste jointe ; saisissez les champs à la main. Les photos ne sont pas encore lues.")
	return /** @type {LocalizedString} */ ("The receipt stays attached; fill the fields by hand. Photos are not read yet.")
});