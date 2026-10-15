/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Forfait_InvoicedInputs */

const en_invoices_add_forfait_invoiced = /** @type {(inputs: Invoices_Add_Forfait_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Already invoiced`)
};

const fr_invoices_add_forfait_invoiced = /** @type {(inputs: Invoices_Add_Forfait_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déjà facturé`)
};

/**
* | output |
* | --- |
* | "Already invoiced" |
*
* @param {Invoices_Add_Forfait_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_forfait_invoiced = /** @type {((inputs?: Invoices_Add_Forfait_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Forfait_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_forfait_invoiced(inputs)
	return en_invoices_add_forfait_invoiced(inputs)
});