/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Column_NumberInputs */

const en_invoices_column_number = /** @type {(inputs: Invoices_Column_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice number`)
};

const fr_invoices_column_number = /** @type {(inputs: Invoices_Column_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Numéro de facture`)
};

/**
* | output |
* | --- |
* | "Invoice number" |
*
* @param {Invoices_Column_NumberInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_column_number = /** @type {((inputs?: Invoices_Column_NumberInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Column_NumberInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_column_number(inputs)
	return en_invoices_column_number(inputs)
});