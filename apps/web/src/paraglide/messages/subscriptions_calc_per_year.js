/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Calc_Per_YearInputs */

const en_subscriptions_calc_per_year = /** @type {(inputs: Subscriptions_Calc_Per_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per year`)
};

const fr_subscriptions_calc_per_year = /** @type {(inputs: Subscriptions_Calc_Per_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Par an`)
};

/**
* | output |
* | --- |
* | "Per year" |
*
* @param {Subscriptions_Calc_Per_YearInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_calc_per_year = /** @type {((inputs?: Subscriptions_Calc_Per_YearInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Calc_Per_YearInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_calc_per_year(inputs)
	return en_subscriptions_calc_per_year(inputs)
});