/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Invoice_Reminders_Sent_OnInputs */

const en_invoice_reminders_sent_on = /** @type {(inputs: Invoice_Reminders_Sent_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reminded on ${i?.date}`)
};

const fr_invoice_reminders_sent_on = /** @type {(inputs: Invoice_Reminders_Sent_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Relancée le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Reminded on {date}" |
*
* @param {Invoice_Reminders_Sent_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_sent_on = /** @type {((inputs: Invoice_Reminders_Sent_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_Sent_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_sent_on(inputs)
	return en_invoice_reminders_sent_on(inputs)
});