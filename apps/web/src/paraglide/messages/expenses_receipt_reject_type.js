/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_Reject_TypeInputs */

const en_expenses_receipt_reject_type = /** @type {(inputs: Expenses_Receipt_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A receipt is a PDF or a photo (JPG, PNG, WebP).`)
};

const fr_expenses_receipt_reject_type = /** @type {(inputs: Expenses_Receipt_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une facture est un PDF ou une photo (JPG, PNG, WebP).`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_reject_type(inputs)
	return en_expenses_receipt_reject_type(inputs)
});