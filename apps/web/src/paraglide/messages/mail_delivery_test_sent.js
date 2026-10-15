/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_Test_SentInputs */

const en_mail_delivery_test_sent = /** @type {(inputs: Mail_Delivery_Test_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The mail relay accepted the first email. The second follows through the queue: if it never arrives, the queue service is not running.`)
};

const fr_mail_delivery_test_sent = /** @type {(inputs: Mail_Delivery_Test_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le serveur d'envoi a accepté le premier e-mail. Le second suit par la file d'attente : s'il n'arrive jamais, le service de file d'attente n'est pas démarré.`)
};

/**
* | output |
* | --- |
* | "The mail relay accepted the first email. The second follows through the queue: if it never arrives, the queue service is not running." |
*
* @param {Mail_Delivery_Test_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_test_sent = /** @type {((inputs?: Mail_Delivery_Test_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_Test_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mail_delivery_test_sent(inputs)
	return en_mail_delivery_test_sent(inputs)
});