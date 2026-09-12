/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr20_HelpInputs */

const en_expense_vat_fr20_help = /** @type {(inputs: Expense_Vat_Fr20_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Standard rate. The invoice shows 20 % TVA; you recover it on the CA3 (box 20).`)
};

const fr_expense_vat_fr20_help = /** @type {(inputs: Expense_Vat_Fr20_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux normal. La facture affiche une TVA de 20 % ; vous la récupérez sur la CA3 (case 20).`)
};

/**
* | output |
* | --- |
* | "Standard rate. The invoice shows 20 % TVA; you recover it on the CA3 (box 20)." |
*
* @param {Expense_Vat_Fr20_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr20_help = /** @type {((inputs?: Expense_Vat_Fr20_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr20_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr20_help(inputs)
	return en_expense_vat_fr20_help(inputs)
});