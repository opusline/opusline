/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Empty_FilteredInputs */

const en_invoices_empty_filtered = /** @type {(inputs: Invoices_Empty_FilteredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change the filter, or add an invoice issued elsewhere.`)
};

const fr_invoices_empty_filtered = /** @type {(inputs: Invoices_Empty_FilteredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changez de filtre, ou ajoutez une facture émise ailleurs.`)
};

/**
* | output |
* | --- |
* | "Change the filter, or add an invoice issued elsewhere." |
*
* @param {Invoices_Empty_FilteredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_empty_filtered = /** @type {((inputs?: Invoices_Empty_FilteredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Empty_FilteredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_empty_filtered(inputs)
	return en_invoices_empty_filtered(inputs)
});