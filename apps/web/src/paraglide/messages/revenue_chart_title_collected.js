/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Chart_Title_CollectedInputs */

const en_revenue_chart_title_collected = /** @type {(inputs: Revenue_Chart_Title_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collected revenue HT by month`)
};

const fr_revenue_chart_title_collected = /** @type {(inputs: Revenue_Chart_Title_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA encaissé HT par mois`)
};

/**
* | output |
* | --- |
* | "Collected revenue HT by month" |
*
* @param {Revenue_Chart_Title_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_chart_title_collected = /** @type {((inputs?: Revenue_Chart_Title_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Chart_Title_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_chart_title_collected(inputs)
	return en_revenue_chart_title_collected(inputs)
});