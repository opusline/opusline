/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Kind_Payment_ReminderInputs */

const en_emails_kind_payment_reminder = /** @type {(inputs: Emails_Kind_Payment_ReminderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment reminder`)
};

const fr_emails_kind_payment_reminder = /** @type {(inputs: Emails_Kind_Payment_ReminderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relance de paiement`)
};

/**
* | output |
* | --- |
* | "Payment reminder" |
*
* @param {Emails_Kind_Payment_ReminderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_kind_payment_reminder = /** @type {((inputs?: Emails_Kind_Payment_ReminderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Kind_Payment_ReminderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_kind_payment_reminder(inputs)
	return en_emails_kind_payment_reminder(inputs)
});