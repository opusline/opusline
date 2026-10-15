/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Invoices_Title_InvoicedInputs */

const en_revenue_invoices_title_invoiced = /** @type {(inputs: Revenue_Invoices_Title_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices issued`)
};

const fr_revenue_invoices_title_invoiced = /** @type {(inputs: Revenue_Invoices_Title_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Factures émises`)
};

/**
* | output |
* | --- |
* | "Invoices issued" |
*
* @param {Revenue_Invoices_Title_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_invoices_title_invoiced = /** @type {((inputs?: Revenue_Invoices_Title_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Invoices_Title_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_invoices_title_invoiced(inputs)
	return en_revenue_invoices_title_invoiced(inputs)
});