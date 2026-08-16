/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Next_PeriodInputs */

const en_revenue_next_period = /** @type {(inputs: Revenue_Next_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next period`)
};

const fr_revenue_next_period = /** @type {(inputs: Revenue_Next_PeriodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période suivante`)
};

/**
* | output |
* | --- |
* | "Next period" |
*
* @param {Revenue_Next_PeriodInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_next_period = /** @type {((inputs?: Revenue_Next_PeriodInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Next_PeriodInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_next_period(inputs)
	return en_revenue_next_period(inputs)
});