/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Period_QuarterInputs */

const en_revenue_period_quarter = /** @type {(inputs: Revenue_Period_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quarter`)
};

const fr_revenue_period_quarter = /** @type {(inputs: Revenue_Period_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trimestre`)
};

/**
* | output |
* | --- |
* | "Quarter" |
*
* @param {Revenue_Period_QuarterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_period_quarter = /** @type {((inputs?: Revenue_Period_QuarterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Period_QuarterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_period_quarter(inputs)
	return en_revenue_period_quarter(inputs)
});