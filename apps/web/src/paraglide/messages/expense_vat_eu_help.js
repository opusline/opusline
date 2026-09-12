/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Eu_HelpInputs */

const en_expense_vat_eu_help = /** @type {(inputs: Expense_Vat_Eu_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A supplier in another EU country who did not charge TVA because you gave them your intra-community TVA number. You declare the French TVA yourself: due and deducted on the same CA3 (boxes 2A, 08 and 20). Nothing to pay, but it has to show.`)
};

const fr_expense_vat_eu_help = /** @type {(inputs: Expense_Vat_Eu_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fournisseur établi dans un autre pays de l'UE qui ne vous a pas facturé de TVA parce que vous lui avez donné votre numéro de TVA intracom. Vous déclarez vous-même la TVA française : elle est due et déduite sur la même CA3 (cases 2A, 08 et 20). Rien à payer, mais elle doit apparaître.`)
};

/**
* | output |
* | --- |
* | "A supplier in another EU country who did not charge TVA because you gave them your intra-community TVA number. You declare the French TVA yourself: due and d..." |
*
* @param {Expense_Vat_Eu_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_eu_help = /** @type {((inputs?: Expense_Vat_Eu_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Eu_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_eu_help(inputs)
	return en_expense_vat_eu_help(inputs)
});