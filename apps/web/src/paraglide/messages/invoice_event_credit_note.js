/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_Credit_NoteInputs */

const en_invoice_event_credit_note = /** @type {(inputs: Invoice_Event_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Credit note issued`)
};

const fr_invoice_event_credit_note = /** @type {(inputs: Invoice_Event_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoir émis`)
};

/**
* | output |
* | --- |
* | "Credit note issued" |
*
* @param {Invoice_Event_Credit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_credit_note = /** @type {((inputs?: Invoice_Event_Credit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_Credit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_credit_note(inputs)
	return en_invoice_event_credit_note(inputs)
});