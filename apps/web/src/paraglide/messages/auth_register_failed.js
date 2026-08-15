/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Register_FailedInputs */

const en_auth_register_failed = /** @type {(inputs: Auth_Register_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registration failed. Try again.`)
};

const fr_auth_register_failed = /** @type {(inputs: Auth_Register_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'inscription a échoué. Réessayez.`)
};

/**
* | output |
* | --- |
* | "Registration failed. Try again." |
*
* @param {Auth_Register_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_register_failed = /** @type {((inputs?: Auth_Register_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Register_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_register_failed(inputs)
	return en_auth_register_failed(inputs)
});