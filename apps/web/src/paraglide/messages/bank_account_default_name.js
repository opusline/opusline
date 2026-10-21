/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Default_NameInputs */

const en_bank_account_default_name = /** @type {(inputs: Bank_Account_Default_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business account`)
};

const fr_bank_account_default_name = /** @type {(inputs: Bank_Account_Default_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte pro`)
};

/**
* | output |
* | --- |
* | "Business account" |
*
* @param {Bank_Account_Default_NameInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_default_name = /** @type {((inputs?: Bank_Account_Default_NameInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Default_NameInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_default_name(inputs)
	return en_bank_account_default_name(inputs)
});