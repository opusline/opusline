/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_Setup_GuideInputs */

const en_mail_delivery_setup_guide = /** @type {(inputs: Mail_Delivery_Setup_GuideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read the email setup guide`)
};

const fr_mail_delivery_setup_guide = /** @type {(inputs: Mail_Delivery_Setup_GuideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire le guide de configuration des e-mails`)
};

/**
* | output |
* | --- |
* | "Read the email setup guide" |
*
* @param {Mail_Delivery_Setup_GuideInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const mail_delivery_setup_guide = /** @type {((inputs?: Mail_Delivery_Setup_GuideInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Mail_Delivery_Setup_GuideInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_mail_delivery_setup_guide(inputs)
	return en_mail_delivery_setup_guide(inputs)
});