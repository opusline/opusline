/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_RemindedInputs */

const en_invoice_event_reminded = /** @type {(inputs: Invoice_Event_RemindedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminder noted`)
};

const fr_invoice_event_reminded = /** @type {(inputs: Invoice_Event_RemindedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relance notée`)
};

/**
* | output |
* | --- |
* | "Reminder noted" |
*
* @param {Invoice_Event_RemindedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_reminded = /** @type {((inputs?: Invoice_Event_RemindedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_RemindedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_reminded(inputs)
	return en_invoice_event_reminded(inputs)
});