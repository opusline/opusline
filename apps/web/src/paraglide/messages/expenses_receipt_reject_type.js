/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_Reject_TypeInputs */



/**
* | output |
* | --- |
* | "A receipt is a PDF or a photo (JPG, PNG, WebP)." |
*
* @param {Expenses_Receipt_Reject_TypeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_reject_type = /** @type {((inputs?: Expenses_Receipt_Reject_TypeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_Reject_TypeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Une facture est un PDF ou une photo (JPG, PNG, WebP).")
	return /** @type {LocalizedString} */ ("A receipt is a PDF or a photo (JPG, PNG, WebP).")
});