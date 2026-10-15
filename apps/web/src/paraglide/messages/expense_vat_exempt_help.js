/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Exempt_HelpInputs */

const en_expense_vat_exempt_help = /** @type {(inputs: Expense_Vat_Exempt_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A purchase outside the scope of TVA: insurance, bank fees, stamps, CFE. Nothing to declare.`)
};

const fr_expense_vat_exempt_help = /** @type {(inputs: Expense_Vat_Exempt_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépense qui n'est pas soumise à la TVA : assurance, frais bancaires, timbres, CFE. Rien à déclarer.`)
};

/**
* | output |
* | --- |
* | "A purchase outside the scope of TVA: insurance, bank fees, stamps, CFE. Nothing to declare." |
*
* @param {Expense_Vat_Exempt_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_exempt_help = /** @type {((inputs?: Expense_Vat_Exempt_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Exempt_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_exempt_help(inputs)
	return en_expense_vat_exempt_help(inputs)
});