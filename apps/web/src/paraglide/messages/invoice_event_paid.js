/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_PaidInputs */

const en_invoice_event_paid = /** @type {(inputs: Invoice_Event_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment received`)
};

const fr_invoice_event_paid = /** @type {(inputs: Invoice_Event_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encaissement`)
};

/**
* | output |
* | --- |
* | "Payment received" |
*
* @param {Invoice_Event_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_paid = /** @type {((inputs?: Invoice_Event_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_paid(inputs)
	return en_invoice_event_paid(inputs)
});