/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Invoices_Title_CollectedInputs */

const en_revenue_invoices_title_collected = /** @type {(inputs: Revenue_Invoices_Title_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices collected`)
};

const fr_revenue_invoices_title_collected = /** @type {(inputs: Revenue_Invoices_Title_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Factures encaissées`)
};

/**
* | output |
* | --- |
* | "Invoices collected" |
*
* @param {Revenue_Invoices_Title_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_invoices_title_collected = /** @type {((inputs?: Revenue_Invoices_Title_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Invoices_Title_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_invoices_title_collected(inputs)
	return en_revenue_invoices_title_collected(inputs)
});