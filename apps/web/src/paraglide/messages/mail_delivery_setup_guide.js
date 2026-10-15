/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Mail_Delivery_Setup_GuideInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Lire le guide de configuration des e-mails")
	return /** @type {LocalizedString} */ ("Read the email setup guide")
});