/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Login_TitleInputs */

const en_auth_login_title = /** @type {(inputs: Auth_Login_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in`)
};

const fr_auth_login_title = /** @type {(inputs: Auth_Login_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connexion`)
};

/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Auth_Login_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_login_title = /** @type {((inputs?: Auth_Login_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Login_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_login_title(inputs)
	return en_auth_login_title(inputs)
});