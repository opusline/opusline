/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Mail_Delivery_Test_HintInputs */

const en_mail_delivery_test_hint = /** @type {(inputs: Mail_Delivery_Test_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sends two emails to ${i?.email}: one straight to the mail relay, one through the queue, the way alerts and reminders travel.`)
};

const fr_mail_delivery_test_hint = /** @type {(inputs: Mail_Delivery_Test_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Envoie deux e-mails à ${i?.email} : l'un directement au serveur d'envoi, l'autre par la file d'attente, comme les alertes et les rappels.`)
};

/**
* | output |
* | --- |
* | "Sends two emails to {email}: one straight to the mail relay, one through the queue, the way alerts and reminders travel." |
*
* @param {Mail_Delivery_Test_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_test_hint = /** @type {((inputs: Mail_Delivery_Test_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_Test_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mail_delivery_test_hint(inputs)
	return en_mail_delivery_test_hint(inputs)
});