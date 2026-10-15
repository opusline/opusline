/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Basis_InvoicedInputs */

const en_revenue_basis_invoiced = /** @type {(inputs: Revenue_Basis_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced`)
};

const fr_revenue_basis_invoiced = /** @type {(inputs: Revenue_Basis_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturé`)
};

/**
* | output |
* | --- |
* | "Invoiced" |
*
* @param {Revenue_Basis_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_basis_invoiced = /** @type {((inputs?: Revenue_Basis_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Basis_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_basis_invoiced(inputs)
	return en_revenue_basis_invoiced(inputs)
});