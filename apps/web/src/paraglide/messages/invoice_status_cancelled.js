/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Status_CancelledInputs */

const en_invoice_status_cancelled = /** @type {(inputs: Invoice_Status_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancelled`)
};

const fr_invoice_status_cancelled = /** @type {(inputs: Invoice_Status_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annulée`)
};

/**
* | output |
* | --- |
* | "Cancelled" |
*
* @param {Invoice_Status_CancelledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_status_cancelled = /** @type {((inputs?: Invoice_Status_CancelledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Status_CancelledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_status_cancelled(inputs)
	return en_invoice_status_cancelled(inputs)
});