/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Subtitle_InvoicedInputs */

const en_revenue_subtitle_invoiced = /** @type {(inputs: Revenue_Subtitle_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue from invoices issued over the period.`)
};

const fr_revenue_subtitle_invoiced = /** @type {(inputs: Revenue_Subtitle_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chiffre d'affaires des factures émises sur la période.`)
};

/**
* | output |
* | --- |
* | "Revenue from invoices issued over the period." |
*
* @param {Revenue_Subtitle_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_subtitle_invoiced = /** @type {((inputs?: Revenue_Subtitle_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Subtitle_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_subtitle_invoiced(inputs)
	return en_revenue_subtitle_invoiced(inputs)
});