/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_TitleInputs */

const en_mail_delivery_title = /** @type {(inputs: Mail_Delivery_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Email delivery`)
};

const fr_mail_delivery_title = /** @type {(inputs: Mail_Delivery_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoi des e-mails`)
};

/**
* | output |
* | --- |
* | "Email delivery" |
*
* @param {Mail_Delivery_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_title = /** @type {((inputs?: Mail_Delivery_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mail_delivery_title(inputs)
	return en_mail_delivery_title(inputs)
});