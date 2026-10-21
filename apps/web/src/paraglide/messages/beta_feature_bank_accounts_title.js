/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_Feature_Bank_Accounts_TitleInputs */

const en_beta_feature_bank_accounts_title = /** @type {(inputs: Beta_Feature_Bank_Accounts_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Several bank accounts`)
};

const fr_beta_feature_bank_accounts_title = /** @type {(inputs: Beta_Feature_Bank_Accounts_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Plusieurs comptes bancaires`)
};

/**
* | output |
* | --- |
* | "Several bank accounts" |
*
* @param {Beta_Feature_Bank_Accounts_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_feature_bank_accounts_title = /** @type {((inputs?: Beta_Feature_Bank_Accounts_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_Feature_Bank_Accounts_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_feature_bank_accounts_title(inputs)
	return en_beta_feature_bank_accounts_title(inputs)
});