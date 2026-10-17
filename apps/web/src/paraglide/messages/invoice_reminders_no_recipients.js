/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Reminders_No_RecipientsInputs */

const en_invoice_reminders_no_recipients = /** @type {(inputs: Invoice_Reminders_No_RecipientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Never e-mailed from Opusline: send it first to be able to remind.`)
};

const fr_invoice_reminders_no_recipients = /** @type {(inputs: Invoice_Reminders_No_RecipientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jamais envoyée depuis Opusline : envoyez-la d'abord pour pouvoir relancer.`)
};

/**
* | output |
* | --- |
* | "Never e-mailed from Opusline: send it first to be able to remind." |
*
* @param {Invoice_Reminders_No_RecipientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_no_recipients = /** @type {((inputs?: Invoice_Reminders_No_RecipientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_No_RecipientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_no_recipients(inputs)
	return en_invoice_reminders_no_recipients(inputs)
});