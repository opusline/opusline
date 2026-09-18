/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Choose_Account_DescriptionInputs */

const en_bank_choose_account_description = /** @type {(inputs: Bank_Choose_Account_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your authorization covers several accounts. Opusline syncs one of them: your business account.`)
};

const fr_bank_choose_account_description = /** @type {(inputs: Bank_Choose_Account_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre autorisation couvre plusieurs comptes. Opusline en synchronise un seul : votre compte pro.`)
};

/**
* | output |
* | --- |
* | "Your authorization covers several accounts. Opusline syncs one of them: your business account." |
*
* @param {Bank_Choose_Account_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_choose_account_description = /** @type {((inputs?: Bank_Choose_Account_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Choose_Account_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_choose_account_description(inputs)
	return en_bank_choose_account_description(inputs)
});