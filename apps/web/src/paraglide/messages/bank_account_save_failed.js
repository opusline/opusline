/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Save_FailedInputs */

const en_bank_account_save_failed = /** @type {(inputs: Bank_Account_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The bank account could not be saved.`)
};

const fr_bank_account_save_failed = /** @type {(inputs: Bank_Account_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le compte bancaire n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The bank account could not be saved." |
*
* @param {Bank_Account_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_save_failed = /** @type {((inputs?: Bank_Account_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_save_failed(inputs)
	return en_bank_account_save_failed(inputs)
});