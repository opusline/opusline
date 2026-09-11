/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_ReopenedInputs */

const en_invoice_event_reopened = /** @type {(inputs: Invoice_Event_ReopenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taken back`)
};

const fr_invoice_event_reopened = /** @type {(inputs: Invoice_Event_ReopenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue en arrière`)
};

/**
* | output |
* | --- |
* | "Taken back" |
*
* @param {Invoice_Event_ReopenedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_reopened = /** @type {((inputs?: Invoice_Event_ReopenedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_ReopenedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_reopened(inputs)
	return en_invoice_event_reopened(inputs)
});