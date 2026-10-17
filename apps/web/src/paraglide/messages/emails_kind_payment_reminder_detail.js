/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Kind_Payment_Reminder_DetailInputs */

const en_emails_kind_payment_reminder_detail = /** @type {(inputs: Emails_Kind_Payment_Reminder_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent when an invoice passes its due date`)
};

const fr_emails_kind_payment_reminder_detail = /** @type {(inputs: Emails_Kind_Payment_Reminder_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyé quand une facture dépasse son échéance`)
};

/**
* | output |
* | --- |
* | "Sent when an invoice passes its due date" |
*
* @param {Emails_Kind_Payment_Reminder_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_kind_payment_reminder_detail = /** @type {((inputs?: Emails_Kind_Payment_Reminder_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Kind_Payment_Reminder_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_kind_payment_reminder_detail(inputs)
	return en_emails_kind_payment_reminder_detail(inputs)
});