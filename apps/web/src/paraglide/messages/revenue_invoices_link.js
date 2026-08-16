/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Invoices_LinkInputs */

const en_revenue_invoices_link = /** @type {(inputs: Revenue_Invoices_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All invoices`)
};

const fr_revenue_invoices_link = /** @type {(inputs: Revenue_Invoices_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toutes les factures`)
};

/**
* | output |
* | --- |
* | "All invoices" |
*
* @param {Revenue_Invoices_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_invoices_link = /** @type {((inputs?: Revenue_Invoices_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Invoices_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_invoices_link(inputs)
	return en_revenue_invoices_link(inputs)
});