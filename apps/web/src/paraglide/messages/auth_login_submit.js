/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Login_SubmitInputs */

const en_auth_login_submit = /** @type {(inputs: Auth_Login_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in`)
};

const fr_auth_login_submit = /** @type {(inputs: Auth_Login_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se connecter`)
};

/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Auth_Login_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_login_submit = /** @type {((inputs?: Auth_Login_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Login_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_login_submit(inputs)
	return en_auth_login_submit(inputs)
});