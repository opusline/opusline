/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_LogoutInputs */

const en_account_logout = /** @type {(inputs: Account_LogoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Log out`)
};

const fr_account_logout = /** @type {(inputs: Account_LogoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se déconnecter`)
};

/**
* | output |
* | --- |
* | "Log out" |
*
* @param {Account_LogoutInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const account_logout = /** @type {((inputs?: Account_LogoutInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_LogoutInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_logout(inputs)
	return en_account_logout(inputs)
});