/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Scope_PaidInputs */

const en_invoices_scope_paid = /** @type {(inputs: Invoices_Scope_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paid`)
};

const fr_invoices_scope_paid = /** @type {(inputs: Invoices_Scope_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payées`)
};

/**
* | output |
* | --- |
* | "Paid" |
*
* @param {Invoices_Scope_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_scope_paid = /** @type {((inputs?: Invoices_Scope_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Scope_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_scope_paid(inputs)
	return en_invoices_scope_paid(inputs)
});