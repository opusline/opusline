/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Back_To_LoginInputs */

const en_auth_back_to_login = /** @type {(inputs: Auth_Back_To_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to sign in`)
};

const fr_auth_back_to_login = /** @type {(inputs: Auth_Back_To_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour à la connexion`)
};

/**
* | output |
* | --- |
* | "Back to sign in" |
*
* @param {Auth_Back_To_LoginInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_back_to_login = /** @type {((inputs?: Auth_Back_To_LoginInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Back_To_LoginInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_back_to_login(inputs)
	return en_auth_back_to_login(inputs)
});