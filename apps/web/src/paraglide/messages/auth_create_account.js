/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Create_AccountInputs */

const en_auth_create_account = /** @type {(inputs: Auth_Create_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create an account`)
};

const fr_auth_create_account = /** @type {(inputs: Auth_Create_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer un compte`)
};

/**
* | output |
* | --- |
* | "Create an account" |
*
* @param {Auth_Create_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_create_account = /** @type {((inputs?: Auth_Create_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Create_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_create_account(inputs)
	return en_auth_create_account(inputs)
});