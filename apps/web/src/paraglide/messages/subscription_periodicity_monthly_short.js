/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Periodicity_Monthly_ShortInputs */

const en_subscription_periodicity_monthly_short = /** @type {(inputs: Subscription_Periodicity_Monthly_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly`)
};

const fr_subscription_periodicity_monthly_short = /** @type {(inputs: Subscription_Periodicity_Monthly_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mensuel`)
};

/**
* | output |
* | --- |
* | "Monthly" |
*
* @param {Subscription_Periodicity_Monthly_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_periodicity_monthly_short = /** @type {((inputs?: Subscription_Periodicity_Monthly_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Periodicity_Monthly_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_periodicity_monthly_short(inputs)
	return en_subscription_periodicity_monthly_short(inputs)
});