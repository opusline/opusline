/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr10_HelpInputs */

const en_expense_vat_fr10_help = /** @type {(inputs: Expense_Vat_Fr10_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intermediate rate: restaurants, transport, hotels. The TVA on meals is only recoverable when the invoice is in the business's name; the TVA on hotel nights never is.`)
};

const fr_expense_vat_fr10_help = /** @type {(inputs: Expense_Vat_Fr10_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux intermédiaire : restaurants, transports, hôtels. La TVA des repas n'est récupérable que si la facture est au nom de l'entreprise ; celle des nuits d'hôtel ne l'est jamais.`)
};

/**
* | output |
* | --- |
* | "Intermediate rate: restaurants, transport, hotels. The TVA on meals is only recoverable when the invoice is in the business's name; the TVA on hotel nights n..." |
*
* @param {Expense_Vat_Fr10_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr10_help = /** @type {((inputs?: Expense_Vat_Fr10_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr10_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr10_help(inputs)
	return en_expense_vat_fr10_help(inputs)
});