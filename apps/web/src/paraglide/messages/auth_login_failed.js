/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Login_FailedInputs */

const en_auth_login_failed = /** @type {(inputs: Auth_Login_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid credentials.`)
};

const fr_auth_login_failed = /** @type {(inputs: Auth_Login_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identifiants invalides.`)
};

/**
* | output |
* | --- |
* | "Invalid credentials." |
*
* @param {Auth_Login_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_login_failed = /** @type {((inputs?: Auth_Login_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Login_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_login_failed(inputs)
	return en_auth_login_failed(inputs)
});