/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Periodicity_MonthlyInputs */

const en_subscription_periodicity_monthly = /** @type {(inputs: Subscription_Periodicity_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`monthly`)
};

const fr_subscription_periodicity_monthly = /** @type {(inputs: Subscription_Periodicity_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`mensuel`)
};

/**
* | output |
* | --- |
* | "monthly" |
*
* @param {Subscription_Periodicity_MonthlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_periodicity_monthly = /** @type {((inputs?: Subscription_Periodicity_MonthlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Periodicity_MonthlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_periodicity_monthly(inputs)
	return en_subscription_periodicity_monthly(inputs)
});