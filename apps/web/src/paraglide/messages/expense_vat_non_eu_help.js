/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Non_Eu_HelpInputs */

const en_expense_vat_non_eu_help = /** @type {(inputs: Expense_Vat_Non_Eu_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A supplier outside the EU who charges no TVA. Same mechanism: due and deducted on the CA3 (boxes 3B, 08 and 20). Nothing to pay, but it has to be declared.`)
};

const fr_expense_vat_non_eu_help = /** @type {(inputs: Expense_Vat_Non_Eu_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fournisseur établi hors UE qui ne facture pas de TVA. Même mécanisme : due et déduite sur la CA3 (cases 3B, 08 et 20). Rien à payer, mais à déclarer.`)
};

/**
* | output |
* | --- |
* | "A supplier outside the EU who charges no TVA. Same mechanism: due and deducted on the CA3 (boxes 3B, 08 and 20). Nothing to pay, but it has to be declared." |
*
* @param {Expense_Vat_Non_Eu_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_non_eu_help = /** @type {((inputs?: Expense_Vat_Non_Eu_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Non_Eu_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_non_eu_help(inputs)
	return en_expense_vat_non_eu_help(inputs)
});