/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Books_ExpenseInputs */

const en_declarations_cfe_books_expense = /** @type {(inputs: Declarations_Cfe_Books_ExpenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Once paid, the CFE books an expense on its own (Taxes · no TVA).`)
};

const fr_declarations_cfe_books_expense = /** @type {(inputs: Declarations_Cfe_Books_ExpenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une fois payée, la CFE crée automatiquement une dépense (Taxes · hors TVA).`)
};

/**
* | output |
* | --- |
* | "Once paid, the CFE books an expense on its own (Taxes · no TVA)." |
*
* @param {Declarations_Cfe_Books_ExpenseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_books_expense = /** @type {((inputs?: Declarations_Cfe_Books_ExpenseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Books_ExpenseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_books_expense(inputs)
	return en_declarations_cfe_books_expense(inputs)
});