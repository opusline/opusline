/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Balance_HelpInputs */

const en_bank_import_balance_help = /** @type {(inputs: Bank_Import_Balance_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Used to compute what can safely be transferred.`)
};

const fr_bank_import_balance_help = /** @type {(inputs: Bank_Import_Balance_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sert au calcul du montant virable en sécurité.`)
};

/**
* | output |
* | --- |
* | "Used to compute what can safely be transferred." |
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