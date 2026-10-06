/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Email_DescriptionInputs */

const en_notifications_email_description = /** @type {(inputs: Notifications_Email_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What Opusline sends to the address you sign in with.`)
};

const fr_notifications_email_description = /** @type {(inputs: Notifications_Email_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce qu'Opusline envoie à l'adresse avec laquelle vous vous connectez.`)
};

/**
* | output |
* | --- |
* | "What Opusline sends to the address you sign in with." |
*
* @param {Notifications_Email_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const notifications_email_description = /** @type {((inputs?: Notifications_Email_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notifications_Email_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notifications_email_description(inputs)
	return en_notifications_email_description(inputs)
});