/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Scope_OpenInputs */

const en_invoices_scope_open = /** @type {(inputs: Invoices_Scope_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To collect`)
};

const fr_invoices_scope_open = /** @type {(inputs: Invoices_Scope_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À encaisser`)
};

/**
* | output |
* | --- |
* | "To collect" |
*
* @param {Invoices_Scope_OpenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_scope_open = /** @type {((inputs?: Invoices_Scope_OpenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Scope_OpenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_scope_open(inputs)
	return en_invoices_scope_open(inputs)
});