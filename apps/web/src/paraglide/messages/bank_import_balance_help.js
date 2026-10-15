/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Balance_HelpInputs */

const en_bank_import_balance_help = /** @type {(inputs: Bank_Import_Balance_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Becomes the account's reference balance. Leave empty to keep the one already entered.`)
};

const fr_bank_import_balance_help = /** @type {(inputs: Bank_Import_Balance_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devient le solde de référence du compte. Laissez vide pour garder celui déjà saisi.`)
};

/**
* | output |
* | --- |
* | "Becomes the account's reference balance. Leave empty to keep the one already entered." |
*
* @param {Bank_Import_Balance_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_balance_help = /** @type {((inputs?: Bank_Import_Balance_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Balance_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_balance_help(inputs)
	return en_bank_import_balance_help(inputs)
});