/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Kpi_Zero_CollectedInputs */

const en_revenue_kpi_zero_collected = /** @type {(inputs: Revenue_Kpi_Zero_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing collected over the period`)
};

const fr_revenue_kpi_zero_collected = /** @type {(inputs: Revenue_Kpi_Zero_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun encaissement sur la période`)
};

/**
* | output |
* | --- |
* | "Nothing collected over the period" |
*
* @param {Revenue_Kpi_Zero_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_kpi_zero_collected = /** @type {((inputs?: Revenue_Kpi_Zero_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Kpi_Zero_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_kpi_zero_collected(inputs)
	return en_revenue_kpi_zero_collected(inputs)
});