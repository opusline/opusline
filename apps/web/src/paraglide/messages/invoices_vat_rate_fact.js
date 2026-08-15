/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Invoices_Vat_Rate_FactInputs */

const en_invoices_vat_rate_fact = /** @type {(inputs: Invoices_Vat_Rate_FactInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`VAT ${i?.rate} %`)
};

const fr_invoices_vat_rate_fact = /** @type {(inputs: Invoices_Vat_Rate_FactInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA ${i?.rate} %`)
};

/**
* | output |
* | --- |
* | "VAT {rate} %" |
*
* @param {Invoices_Vat_Rate_FactInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_vat_rate_fact = /** @type {((inputs: Invoices_Vat_Rate_FactInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Vat_Rate_FactInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_vat_rate_fact(inputs)
	return en_invoices_vat_rate_fact(inputs)
});