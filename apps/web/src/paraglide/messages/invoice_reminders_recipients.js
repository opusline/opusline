/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ recipients: NonNullable<unknown> }} Invoice_Reminders_RecipientsInputs */

const en_invoice_reminders_recipients = /** @type {(inputs: Invoice_Reminders_RecipientsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`To ${i?.recipients}`)
};

const fr_invoice_reminders_recipients = /** @type {(inputs: Invoice_Reminders_RecipientsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`À ${i?.recipients}`)
};

/**
* | output |
* | --- |
* | "To {recipients}" |
*
* @param {Invoice_Reminders_RecipientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_recipients = /** @type {((inputs: Invoice_Reminders_RecipientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_RecipientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_recipients(inputs)
	return en_invoice_reminders_recipients(inputs)
});