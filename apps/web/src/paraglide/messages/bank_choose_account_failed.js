/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Choose_Account_FailedInputs */

const en_bank_choose_account_failed = /** @type {(inputs: Bank_Choose_Account_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This account could not be chosen.`)
};

const fr_bank_choose_account_failed = /** @type {(inputs: Bank_Choose_Account_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce compte n'a pas pu être choisi.`)
};

/**
* | output |
* | --- |
* | "This account could not be chosen." |
*
* @param {Bank_Choose_Account_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_choose_account_failed = /** @type {((inputs?: Bank_Choose_Account_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Choose_Account_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_choose_account_failed(inputs)
	return en_bank_choose_account_failed(inputs)
});