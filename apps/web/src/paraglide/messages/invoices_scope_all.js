/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Scope_AllInputs */

const en_invoices_scope_all = /** @type {(inputs: Invoices_Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All`)
};

const fr_invoices_scope_all = /** @type {(inputs: Invoices_Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toutes`)
};

/**
* | output |
* | --- |
* | "All" |
*
* @param {Invoices_Scope_AllInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_scope_all = /** @type {((inputs?: Invoices_Scope_AllInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Scope_AllInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_scope_all(inputs)
	return en_invoices_scope_all(inputs)
});