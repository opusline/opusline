/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr10_HelpInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Taux intermédiaire : restaurants, transports, hôtels. La TVA des repas n'est récupérable que si la facture est au nom de l'entreprise ; celle des nuits d'hôtel ne l'est jamais.")
	return /** @type {LocalizedString} */ ("Intermediate rate: restaurants, transport, hotels. The TVA on meals is only recoverable when the invoice is in the business's name; the TVA on hotel nights never is.")
});