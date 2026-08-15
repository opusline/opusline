/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Status_SentInputs */

const en_invoice_status_sent = /** @type {(inputs: Invoice_Status_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent`)
};

const fr_invoice_status_sent = /** @type {(inputs: Invoice_Status_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyée`)
};

/**
* | output |
* | --- |
* | "Sent" |
*
* @param {Invoice_Status_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_status_sent = /** @type {((inputs?: Invoice_Status_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Status_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_status_sent(inputs)
	return en_invoice_status_sent(inputs)
});