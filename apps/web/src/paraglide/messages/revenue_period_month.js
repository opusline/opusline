/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Period_MonthInputs */

const en_revenue_period_month = /** @type {(inputs: Revenue_Period_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month`)
};

const fr_revenue_period_month = /** @type {(inputs: Revenue_Period_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois`)
};

/**
* | output |
* | --- |
* | "Month" |
*
* @param {Revenue_Period_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_period_month = /** @type {((inputs?: Revenue_Period_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Period_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_period_month(inputs)
	return en_revenue_period_month(inputs)
});