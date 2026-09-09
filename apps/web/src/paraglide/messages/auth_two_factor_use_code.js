/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Use_CodeInputs */

const en_auth_two_factor_use_code = /** @type {(inputs: Auth_Two_Factor_Use_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use the authenticator app`)
};

const fr_auth_two_factor_use_code = /** @type {(inputs: Auth_Two_Factor_Use_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utiliser l'application d'authentification`)
};

/**
* | output |
* | --- |
* | "Use the authenticator app" |
*
* @param {Auth_Two_Factor_Use_CodeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_use_code = /** @type {((inputs?: Auth_Two_Factor_Use_CodeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Use_CodeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_use_code(inputs)
	return en_auth_two_factor_use_code(inputs)
});