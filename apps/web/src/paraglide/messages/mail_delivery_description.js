/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_DescriptionInputs */

const en_mail_delivery_description = /** @type {(inputs: Mail_Delivery_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Whether this instance can send email, and a way to check that it does.`)
};

const fr_mail_delivery_description = /** @type {(inputs: Mail_Delivery_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce que cette instance peut envoyer par e-mail, et un moyen de le vérifier.`)
};

/**
* | output |
* | --- |
* | "Whether this instance can send email, and a way to check that it does." |
*
* @param {Mail_Delivery_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_description = /** @type {((inputs?: Mail_Delivery_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mail_delivery_description(inputs)
	return en_mail_delivery_description(inputs)
});