/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Forgot_DescriptionInputs */

const en_auth_forgot_description = /** @type {(inputs: Auth_Forgot_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the address you sign in with and we will email you a link to choose a new password.`)
};

const fr_auth_forgot_description = /** @type {(inputs: Auth_Forgot_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisissez l'adresse avec laquelle vous vous connectez : nous vous enverrons un lien pour choisir un nouveau mot de passe.`)
};

/**
* | output |
* | --- |
* | "Enter the address you sign in with and we will email you a link to choose a new password." |
*
* @param {Auth_Forgot_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_forgot_description = /** @type {((inputs?: Auth_Forgot_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Forgot_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_forgot_description(inputs)
	return en_auth_forgot_description(inputs)
});