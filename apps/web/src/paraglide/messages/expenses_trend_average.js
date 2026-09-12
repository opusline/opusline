/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Expenses_Trend_AverageInputs */

const en_expenses_trend_average = /** @type {(inputs: Expenses_Trend_AverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`average ${i?.amount}`)
};

const fr_expenses_trend_average = /** @type {(inputs: Expenses_Trend_AverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`moyenne ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "average {amount}" |
*
* @param {Expenses_Trend_AverageInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_trend_average = /** @type {((inputs: Expenses_Trend_AverageInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Trend_AverageInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_trend_average(inputs)
	return en_expenses_trend_average(inputs)
});