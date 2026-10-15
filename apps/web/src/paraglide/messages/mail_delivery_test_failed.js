/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_Test_FailedInputs */

const en_mail_delivery_test_failed = /** @type {(inputs: Mail_Delivery_Test_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The test email could not be sent. Try again in a moment.`)
};

const fr_mail_delivery_test_failed = /** @type {(inputs: Mail_Delivery_Test_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'e-mail de test n'a pas pu être envoyé. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The test email could not be sent. Try again in a moment." |
*
* @param {Mail_Delivery_Test_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_test_failed = /** @type {((inputs?: Mail_Delivery_Test_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_Test_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mail_delivery_test_failed(inputs)
	return en_mail_delivery_test_failed(inputs)
});