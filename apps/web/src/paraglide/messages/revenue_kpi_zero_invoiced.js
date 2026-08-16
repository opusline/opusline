/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Kpi_Zero_InvoicedInputs */

const en_revenue_kpi_zero_invoiced = /** @type {(inputs: Revenue_Kpi_Zero_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No invoice issued over the period`)
};

const fr_revenue_kpi_zero_invoiced = /** @type {(inputs: Revenue_Kpi_Zero_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune facture émise sur la période`)
};

/**
* | output |
* | --- |
* | "No invoice issued over the period" |
*
* @param {Revenue_Kpi_Zero_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_kpi_zero_invoiced = /** @type {((inputs?: Revenue_Kpi_Zero_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Kpi_Zero_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_kpi_zero_invoiced(inputs)
	return en_revenue_kpi_zero_invoiced(inputs)
});