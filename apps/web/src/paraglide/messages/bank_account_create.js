/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_CreateInputs */

const en_bank_account_create = /** @type {(inputs: Bank_Account_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add an account`)
};

const fr_bank_account_create = /** @type {(inputs: Bank_Account_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un compte`)
};

/**
* | output |
* | --- |
* | "Add an account" |
*
* @param {Bank_Account_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_create = /** @type {((inputs?: Bank_Account_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_create(inputs)
	return en_bank_account_create(inputs)
});