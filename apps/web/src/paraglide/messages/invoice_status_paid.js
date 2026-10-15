/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Status_PaidInputs */

const en_invoice_status_paid = /** @type {(inputs: Invoice_Status_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paid`)
};

const fr_invoice_status_paid = /** @type {(inputs: Invoice_Status_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payée`)
};

/**
* | output |
* | --- |
* | "Paid" |
*
* @param {Invoice_Status_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_status_paid = /** @type {((inputs?: Invoice_Status_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Status_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_status_paid(inputs)
	return en_invoice_status_paid(inputs)
});