/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_Feature_Bank_Accounts_DescriptionInputs */

const en_beta_feature_bank_accounts_description = /** @type {(inputs: Beta_Feature_Bank_Accounts_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connect several banks side by side, each account with its own balance, and see transfers between them recognized.`)
};

const fr_beta_feature_bank_accounts_description = /** @type {(inputs: Beta_Feature_Bank_Accounts_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connectez plusieurs banques côte à côte, chaque compte avec son propre solde, et voyez les virements entre eux reconnus.`)
};

/**
* | output |
* | --- |
* | "Connect several banks side by side, each account with its own balance, and see transfers between them recognized." |
*
* @param {Beta_Feature_Bank_Accounts_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_feature_bank_accounts_description = /** @type {((inputs?: Beta_Feature_Bank_Accounts_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_Feature_Bank_Accounts_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_feature_bank_accounts_description(inputs)
	return en_beta_feature_bank_accounts_description(inputs)
});