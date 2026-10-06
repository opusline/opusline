/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Email_TitleInputs */

const en_notifications_email_title = /** @type {(inputs: Notifications_Email_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Email notifications`)
};

const fr_notifications_email_title = /** @type {(inputs: Notifications_Email_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications par e-mail`)
};

/**
* | output |
* | --- |
* | "Email notifications" |
*
* @param {Notifications_Email_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const notifications_email_title = /** @type {((inputs?: Notifications_Email_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notifications_Email_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notifications_email_title(inputs)
	return en_notifications_email_title(inputs)
});