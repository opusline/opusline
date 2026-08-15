/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Paid_On_HintInputs */

const en_invoices_paid_on_hint = /** @type {(inputs: Invoices_Paid_On_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The date the money arrived. URSSAF and VAT attach the revenue to this date, not to the invoice's.`)
};

const fr_invoices_paid_on_hint = /** @type {(inputs: Invoices_Paid_On_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La date où l'argent est arrivé. URSSAF et TVA rattachent la recette à cette date, pas à celle de la facture.`)
};

/**
* | output |
* | --- |
* | "The date the money arrived. URSSAF and VAT attach the revenue to this date, not to the invoice's." |
*
* @param {Invoices_Paid_On_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_paid_on_hint = /** @type {((inputs?: Invoices_Paid_On_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Paid_On_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_paid_on_hint(inputs)
	return en_invoices_paid_on_hint(inputs)
});