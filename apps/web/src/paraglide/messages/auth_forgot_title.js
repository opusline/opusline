/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Forgot_TitleInputs */

const en_auth_forgot_title = /** @type {(inputs: Auth_Forgot_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reset your password`)
};

const fr_auth_forgot_title = /** @type {(inputs: Auth_Forgot_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réinitialiser votre mot de passe`)
};

/**
* | output |
* | --- |
* | "Reset your password" |
*
* @param {Auth_Forgot_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_forgot_title = /** @type {((inputs?: Auth_Forgot_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Forgot_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_forgot_title(inputs)
	return en_auth_forgot_title(inputs)
});