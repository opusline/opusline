/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_No_AccountInputs */

const en_auth_no_account = /** @type {(inputs: Auth_No_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No account yet?`)
};

const fr_auth_no_account = /** @type {(inputs: Auth_No_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encore de compte ?`)
};

/**
* | output |
* | --- |
* | "No account yet?" |
*
* @param {Auth_No_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_no_account = /** @type {((inputs?: Auth_No_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_No_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_no_account(inputs)
	return en_auth_no_account(inputs)
});