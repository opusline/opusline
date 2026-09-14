/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Password_DescriptionInputs */

const en_security_password_description = /** @type {(inputs: Security_Password_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changing it signs you out everywhere else and forgets the browsers you trusted.`)
};

const fr_security_password_description = /** @type {(inputs: Security_Password_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le changer vous déconnecte partout ailleurs et oublie les navigateurs auxquels vous faisiez confiance.`)
};

/**
* | output |
* | --- |
* | "Changing it signs you out everywhere else and forgets the browsers you trusted." |
*
* @param {Security_Password_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_password_description = /** @type {((inputs?: Security_Password_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Password_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_password_description(inputs)
	return en_security_password_description(inputs)
});