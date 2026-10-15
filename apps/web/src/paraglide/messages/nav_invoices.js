/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_InvoicesInputs */

const en_nav_invoices = /** @type {(inputs: Nav_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices`)
};

const fr_nav_invoices = /** @type {(inputs: Nav_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Factures`)
};

/**
* | output |
* | --- |
* | "Invoices" |
*
* @param {Nav_InvoicesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_invoices = /** @type {((inputs?: Nav_InvoicesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_InvoicesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_invoices(inputs)
	return en_nav_invoices(inputs)
});