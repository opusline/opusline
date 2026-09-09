/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Use_PasskeyInputs */

const en_auth_two_factor_use_passkey = /** @type {(inputs: Auth_Two_Factor_Use_PasskeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use a passkey`)
};

const fr_auth_two_factor_use_passkey = /** @type {(inputs: Auth_Two_Factor_Use_PasskeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utiliser une clé d'accès`)
};

/**
* | output |
* | --- |
* | "Use a passkey" |
*
* @param {Auth_Two_Factor_Use_PasskeyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_use_passkey = /** @type {((inputs?: Auth_Two_Factor_Use_PasskeyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Use_PasskeyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_use_passkey(inputs)
	return en_auth_two_factor_use_passkey(inputs)
});