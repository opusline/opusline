/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Account_LabelInputs */

const en_bank_import_account_label = /** @type {(inputs: Bank_Import_Account_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank account`)
};

const fr_bank_import_account_label = /** @type {(inputs: Bank_Import_Account_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte bancaire`)
};

/**
* | output |
* | --- |
* | "Bank account" |
*
* @param {Bank_Import_Account_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_account_label = /** @type {((inputs?: Bank_Import_Account_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Account_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_account_label(inputs)
	return en_bank_import_account_label(inputs)
});