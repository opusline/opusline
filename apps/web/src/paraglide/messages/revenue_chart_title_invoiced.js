/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Chart_Title_InvoicedInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("CA facturé HT par mois")
	return /** @type {LocalizedString} */ ("Invoiced revenue HT by month")
});