/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Chart_Title_InvoicedInputs */

const en_revenue_chart_title_invoiced = /** @type {(inputs: Revenue_Chart_Title_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced revenue HT by month`)
};

const fr_revenue_chart_title_invoiced = /** @type {(inputs: Revenue_Chart_Title_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA facturé HT par mois`)
};

/**
* | output |
* | --- |
* | "Invoiced revenue HT by month" |
*
* @param {Revenue_Chart_Title_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_chart_title_invoiced = /** @type {((inputs?: Revenue_Chart_Title_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Chart_Title_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_chart_title_invoiced(inputs)
	return en_revenue_chart_title_invoiced(inputs)
});