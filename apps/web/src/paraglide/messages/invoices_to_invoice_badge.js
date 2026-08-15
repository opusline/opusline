/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_To_Invoice_BadgeInputs */

const en_invoices_to_invoice_badge = /** @type {(inputs: Invoices_To_Invoice_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To invoice`)
};

const fr_invoices_to_invoice_badge = /** @type {(inputs: Invoices_To_Invoice_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À facturer`)
};

/**
* | output |
* | --- |
* | "To invoice" |
*
* @param {Invoices_To_Invoice_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_to_invoice_badge = /** @type {((inputs?: Invoices_To_Invoice_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_To_Invoice_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_to_invoice_badge(inputs)
	return en_invoices_to_invoice_badge(inputs)
});