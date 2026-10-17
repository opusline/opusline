/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_Payment_RecordedInputs */

const en_invoice_event_payment_recorded = /** @type {(inputs: Invoice_Event_Payment_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partial payment received`)
};

const fr_invoice_event_payment_recorded = /** @type {(inputs: Invoice_Event_Payment_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paiement partiel reçu`)
};

/**
* | output |
* | --- |
* | "Partial payment received" |
*
* @param {Invoice_Event_Payment_RecordedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_payment_recorded = /** @type {((inputs?: Invoice_Event_Payment_RecordedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_Payment_RecordedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_payment_recorded(inputs)
	return en_invoice_event_payment_recorded(inputs)
});