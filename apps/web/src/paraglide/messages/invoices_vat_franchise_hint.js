/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Vat_Franchise_HintInputs */



/**
* | output |
* | --- |
* | "No VAT: your account is under the franchise en base." |
*
* @param {Invoices_Vat_Franchise_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_vat_franchise_hint = /** @type {((inputs?: Invoices_Vat_Franchise_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Vat_Franchise_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Pas de TVA : votre compte est en franchise en base.")
	return /** @type {LocalizedString} */ ("No VAT: your account is under the franchise en base.")
});