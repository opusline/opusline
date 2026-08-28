/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Category_InvoicesInputs */

const en_deadline_category_invoices = /** @type {(inputs: Deadline_Category_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices`)
};

const fr_deadline_category_invoices = /** @type {(inputs: Deadline_Category_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Factures`)
};

/**
* | output |
* | --- |
* | "Invoices" |
*
* @param {Deadline_Category_InvoicesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_category_invoices = /** @type {((inputs?: Deadline_Category_InvoicesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Category_InvoicesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_category_invoices(inputs)
	return en_deadline_category_invoices(inputs)
});