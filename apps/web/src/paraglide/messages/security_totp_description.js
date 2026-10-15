/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_DescriptionInputs */

const en_security_totp_description = /** @type {(inputs: Security_Totp_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask for a six-digit code from an app such as Aegis, 1Password or Google Authenticator every time you sign in with your password.`)
};

const fr_security_totp_description = /** @type {(inputs: Security_Totp_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Demandez un code à six chiffres issu d'une application comme Aegis, 1Password ou Google Authenticator à chaque connexion par mot de passe.`)
};

/**
* | output |
* | --- |
* | "Ask for a six-digit code from an app such as Aegis, 1Password or Google Authenticator every time you sign in with your password." |
*
* @param {Security_Totp_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_description = /** @type {((inputs?: Security_Totp_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_description(inputs)
	return en_security_totp_description(inputs)
});