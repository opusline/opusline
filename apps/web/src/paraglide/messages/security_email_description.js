/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Security_Email_DescriptionInputs */

const en_security_email_description = /** @type {(inputs: Security_Email_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`You sign in with ${i?.email}. Changing it forgets the browsers you trusted. The contact email shown on your documents is a separate setting, under Identity.`)
};

const fr_security_email_description = /** @type {(inputs: Security_Email_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Vous vous connectez avec ${i?.email}. La changer oublie les navigateurs auxquels vous faisiez confiance. L'e-mail de contact affiché sur vos documents est un réglage distinct, dans Identité.`)
};

/**
* | output |
* | --- |
* | "You sign in with {email}. Changing it forgets the browsers you trusted. The contact email shown on your documents is a separate setting, under Identity." |
*
* @param {Security_Email_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_email_description = /** @type {((inputs: Security_Email_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Email_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_email_description(inputs)
	return en_security_email_description(inputs)
});