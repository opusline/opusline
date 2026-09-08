/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Method_PasskeyInputs */

const en_auth_method_passkey = /** @type {(inputs: Auth_Method_PasskeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Passkey`)
};

const fr_auth_method_passkey = /** @type {(inputs: Auth_Method_PasskeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clé d'accès`)
};

/**
* | output |
* | --- |
* | "Passkey" |
*
* @param {Auth_Method_PasskeyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_method_passkey = /** @type {((inputs?: Auth_Method_PasskeyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Method_PasskeyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_method_passkey(inputs)
	return en_auth_method_passkey(inputs)
});