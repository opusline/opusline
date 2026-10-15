/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Passkey_FailedInputs */

const en_auth_passkey_failed = /** @type {(inputs: Auth_Passkey_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The passkey could not be used. Try again or sign in with your password.`)
};

const fr_auth_passkey_failed = /** @type {(inputs: Auth_Passkey_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La clé d'accès n'a pas pu être utilisée. Réessayez ou connectez-vous avec votre mot de passe.`)
};

/**
* | output |
* | --- |
* | "The passkey could not be used. Try again or sign in with your password." |
*
* @param {Auth_Passkey_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_passkey_failed = /** @type {((inputs?: Auth_Passkey_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Passkey_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_passkey_failed(inputs)
	return en_auth_passkey_failed(inputs)
});