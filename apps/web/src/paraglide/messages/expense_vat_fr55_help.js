/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr55_HelpInputs */

const en_expense_vat_fr55_help = /** @type {(inputs: Expense_Vat_Fr55_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reduced rate: books, food.`)
};

const fr_expense_vat_fr55_help = /** @type {(inputs: Expense_Vat_Fr55_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux réduit : livres, produits alimentaires.`)
};

/**
* | output |
* | --- |
* | "Reduced rate: books, food." |
*
* @param {Expense_Vat_Fr55_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr55_help = /** @type {((inputs?: Expense_Vat_Fr55_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr55_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr55_help(inputs)
	return en_expense_vat_fr55_help(inputs)
});