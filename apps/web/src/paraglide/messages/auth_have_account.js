/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Have_AccountInputs */

const en_auth_have_account = /** @type {(inputs: Auth_Have_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Already have an account?`)
};

const fr_auth_have_account = /** @type {(inputs: Auth_Have_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déjà un compte ?`)
};

/**
* | output |
* | --- |
* | "Already have an account?" |
*
* @param {Auth_Have_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_have_account = /** @type {((inputs?: Auth_Have_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Have_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_have_account(inputs)
	return en_auth_have_account(inputs)
});