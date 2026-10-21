/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Accounts_TitleInputs */

const en_bank_accounts_title = /** @type {(inputs: Bank_Accounts_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank accounts`)
};

const fr_bank_accounts_title = /** @type {(inputs: Bank_Accounts_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Comptes bancaires`)
};

/**
* | output |
* | --- |
* | "Bank accounts" |
*
* @param {Bank_Accounts_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_accounts_title = /** @type {((inputs?: Bank_Accounts_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Accounts_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_accounts_title(inputs)
	return en_bank_accounts_title(inputs)
});