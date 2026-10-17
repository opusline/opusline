/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_EmailedInputs */

const en_invoice_event_emailed = /** @type {(inputs: Invoice_Event_EmailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-mailed to the client`)
};

const fr_invoice_event_emailed = /** @type {(inputs: Invoice_Event_EmailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyée au client par e-mail`)
};

/**
* | output |
* | --- |
* | "E-mailed to the client" |
*
* @param {Invoice_Event_EmailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_emailed = /** @type {((inputs?: Invoice_Event_EmailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_EmailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_emailed(inputs)
	return en_invoice_event_emailed(inputs)
});