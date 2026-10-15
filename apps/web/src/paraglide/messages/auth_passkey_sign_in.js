/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Passkey_Sign_InInputs */



/**
* | output |
* | --- |
* | "Sign in with a passkey" |
*
* @param {Auth_Passkey_Sign_InInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_passkey_sign_in = /** @type {((inputs?: Auth_Passkey_Sign_InInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Passkey_Sign_InInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Se connecter avec une clé d'accès")
	return /** @type {LocalizedString} */ ("Sign in with a passkey")
});