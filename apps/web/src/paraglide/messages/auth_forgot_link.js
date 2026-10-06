/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Forgot_LinkInputs */

const en_auth_forgot_link = /** @type {(inputs: Auth_Forgot_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forgot your password?`)
};

const fr_auth_forgot_link = /** @type {(inputs: Auth_Forgot_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mot de passe oublié ?`)
};

/**
* | output |
* | --- |
* | "Forgot your password?" |
*
* @param {Auth_Forgot_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_forgot_link = /** @type {((inputs?: Auth_Forgot_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Forgot_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_forgot_link(inputs)
	return en_auth_forgot_link(inputs)
});