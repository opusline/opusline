/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Balance_LabelInputs */

const en_bank_import_balance_label = /** @type {(inputs: Bank_Import_Balance_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business account balance at the statement date`)
};

const fr_bank_import_balance_label = /** @type {(inputs: Bank_Import_Balance_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solde du compte pro à la date du relevé`)
};

/**
* | output |
* | --- |
* | "Business account balance at the statement date" |
*
* @param {Bank_Import_Balance_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_balance_label = /** @type {((inputs?: Bank_Import_Balance_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Balance_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_balance_label(inputs)
	return en_bank_import_balance_label(inputs)
});