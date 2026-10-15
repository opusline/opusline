/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Bank_Balance_SubInputs */



/**
* | output |
* | --- |
* | "entered by hand · import a statement" |
*
* @param {Invoices_Bank_Balance_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_bank_balance_sub = /** @type {((inputs?: Invoices_Bank_Balance_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Bank_Balance_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("saisi à la main · importer un relevé")
	return /** @type {LocalizedString} */ ("entered by hand · import a statement")
});