/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_Test_ButtonInputs */



/**
* | output |
* | --- |
* | "Send a test email" |
*
* @param {Mail_Delivery_Test_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_test_button = /** @type {((inputs?: Mail_Delivery_Test_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_Test_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Envoyer un e-mail de test")
	return /** @type {LocalizedString} */ ("Send a test email")
});