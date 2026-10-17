/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Invoice_Reminders_NextInputs */

const en_invoice_reminders_next = /** @type {(inputs: Invoice_Reminders_NextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Next reminder on ${i?.date}`)
};

const fr_invoice_reminders_next = /** @type {(inputs: Invoice_Reminders_NextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prochaine relance le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Next reminder on {date}" |
*
* @param {Invoice_Reminders_NextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_next = /** @type {((inputs: Invoice_Reminders_NextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_NextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_next(inputs)
	return en_invoice_reminders_next(inputs)
});