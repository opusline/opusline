/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ delta: NonNullable<unknown>, period: NonNullable<unknown>, amount: NonNullable<unknown> }} Revenue_Trend_VsInputs */

const en_revenue_trend_vs = /** @type {(inputs: Revenue_Trend_VsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.delta} % vs ${i?.period} (${i?.amount})`)
};

const fr_revenue_trend_vs = /** @type {(inputs: Revenue_Trend_VsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.delta} % vs ${i?.period} (${i?.amount})`)
};

/**
* | output |
* | --- |
* | "{delta} % vs {period} ({amount})" |
*
* @param {Revenue_Trend_VsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_trend_vs = /** @type {((inputs: Revenue_Trend_VsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Trend_VsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_trend_vs(inputs)
	return en_revenue_trend_vs(inputs)
});