/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Month_All_BilledInputs */

const en_invoices_month_all_billed = /** @type {(inputs: Invoices_Month_All_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All time tracked this month is invoiced.`)
};

const fr_invoices_month_all_billed = /** @type {(inputs: Invoices_Month_All_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tout le temps saisi ce mois-ci est facturé.`)
};

/**
* | output |
* | --- |
* | "All time tracked this month is invoiced." |
*
* @param {Invoices_Month_All_BilledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_month_all_billed = /** @type {((inputs?: Invoices_Month_All_BilledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Month_All_BilledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_month_all_billed(inputs)
	return en_invoices_month_all_billed(inputs)
});