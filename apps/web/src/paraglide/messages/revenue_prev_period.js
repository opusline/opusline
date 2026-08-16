/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Prev_PeriodInputs */

const en_revenue_prev_period = /** @type {(inputs: Revenue_Prev_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous period`)
};

const fr_revenue_prev_period = /** @type {(inputs: Revenue_Prev_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période précédente`)
};

/**
* | output |
* | --- |
* | "Previous period" |
*
* @param {Revenue_Prev_PeriodInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_prev_period = /** @type {((inputs?: Revenue_Prev_PeriodInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Prev_PeriodInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_prev_period(inputs)
	return en_revenue_prev_period(inputs)
});