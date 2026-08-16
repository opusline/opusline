/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ period: NonNullable<unknown> }} Revenue_Invoices_Empty_InvoicedInputs */

const en_revenue_invoices_empty_invoiced = /** @type {(inputs: Revenue_Invoices_Empty_InvoicedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nothing issued in ${i?.period}.`)
};

const fr_revenue_invoices_empty_invoiced = /** @type {(inputs: Revenue_Invoices_Empty_InvoicedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rien d'émis sur ${i?.period}.`)
};

/**
* | output |
* | --- |
* | "Nothing issued in {period}." |
*
* @param {Revenue_Invoices_Empty_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_invoices_empty_invoiced = /** @type {((inputs: Revenue_Invoices_Empty_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Invoices_Empty_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_invoices_empty_invoiced(inputs)
	return en_revenue_invoices_empty_invoiced(inputs)
});