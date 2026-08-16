/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Trend_None_MonthInputs */

const en_revenue_trend_none_month = /** @type {(inputs: Revenue_Trend_None_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing comparable in the previous month`)
};

const fr_revenue_trend_none_month = /** @type {(inputs: Revenue_Trend_None_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien de comparable sur le mois précédent`)
};

/**
* | output |
* | --- |
* | "Nothing comparable in the previous month" |
*
* @param {Revenue_Trend_None_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_trend_none_month = /** @type {((inputs?: Revenue_Trend_None_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Trend_None_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_trend_none_month(inputs)
	return en_revenue_trend_none_month(inputs)
});