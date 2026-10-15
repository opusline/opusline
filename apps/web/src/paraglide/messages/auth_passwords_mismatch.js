/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Passwords_MismatchInputs */

const en_auth_passwords_mismatch = /** @type {(inputs: Auth_Passwords_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The passwords do not match.`)
};

const fr_auth_passwords_mismatch = /** @type {(inputs: Auth_Passwords_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les mots de passe ne correspondent pas.`)
};

/**
* | output |
* | --- |
* | "The passwords do not match." |
*
* @param {Auth_Passwords_MismatchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_passwords_mismatch = /** @type {((inputs?: Auth_Passwords_MismatchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Passwords_MismatchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_passwords_mismatch(inputs)
	return en_auth_passwords_mismatch(inputs)
});