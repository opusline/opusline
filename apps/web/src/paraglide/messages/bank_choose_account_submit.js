/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Choose_Account_SubmitInputs */

const en_bank_choose_account_submit = /** @type {(inputs: Bank_Choose_Account_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sync this account`)
};

const fr_bank_choose_account_submit = /** @type {(inputs: Bank_Choose_Account_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Synchroniser ce compte`)
};

/**
* | output |
* | --- |
* | "Sync this account" |
*
* @param {Bank_Choose_Account_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_choose_account_submit = /** @type {((inputs?: Bank_Choose_Account_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Choose_Account_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_choose_account_submit(inputs)
	return en_bank_choose_account_submit(inputs)
});