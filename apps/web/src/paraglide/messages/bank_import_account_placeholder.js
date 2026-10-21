/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Account_PlaceholderInputs */

const en_bank_import_account_placeholder = /** @type {(inputs: Bank_Import_Account_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose the account this statement comes from`)
};

const fr_bank_import_account_placeholder = /** @type {(inputs: Bank_Import_Account_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez le compte dont vient ce relevé`)
};

/**
* | output |
* | --- |
* | "Choose the account this statement comes from" |
*
* @param {Bank_Import_Account_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_account_placeholder = /** @type {((inputs?: Bank_Import_Account_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Account_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_account_placeholder(inputs)
	return en_bank_import_account_placeholder(inputs)
});