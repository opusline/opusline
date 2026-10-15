/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Kpi_Invoiced_TitleInputs */

const en_revenue_kpi_invoiced_title = /** @type {(inputs: Revenue_Kpi_Invoiced_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced revenue HT`)
};

const fr_revenue_kpi_invoiced_title = /** @type {(inputs: Revenue_Kpi_Invoiced_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA facturé HT`)
};

/**
* | output |
* | --- |
* | "Invoiced revenue HT" |
*
* @param {Revenue_Kpi_Invoiced_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_kpi_invoiced_title = /** @type {((inputs?: Revenue_Kpi_Invoiced_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Kpi_Invoiced_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_kpi_invoiced_title(inputs)
	return en_revenue_kpi_invoiced_title(inputs)
});