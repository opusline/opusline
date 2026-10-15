/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Period_YearInputs */

const en_revenue_period_year = /** @type {(inputs: Revenue_Period_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Year`)
};

const fr_revenue_period_year = /** @type {(inputs: Revenue_Period_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Année`)
};

/**
* | output |
* | --- |
* | "Year" |
*
* @param {Revenue_Period_YearInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_period_year = /** @type {((inputs?: Revenue_Period_YearInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Period_YearInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_period_year(inputs)
	return en_revenue_period_year(inputs)
});