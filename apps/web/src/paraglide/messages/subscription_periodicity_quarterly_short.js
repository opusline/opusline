/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Periodicity_Quarterly_ShortInputs */

const en_subscription_periodicity_quarterly_short = /** @type {(inputs: Subscription_Periodicity_Quarterly_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quarterly`)
};

const fr_subscription_periodicity_quarterly_short = /** @type {(inputs: Subscription_Periodicity_Quarterly_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trim.`)
};

/**
* | output |
* | --- |
* | "Quarterly" |
*
* @param {Subscription_Periodicity_Quarterly_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_periodicity_quarterly_short = /** @type {((inputs?: Subscription_Periodicity_Quarterly_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Periodicity_Quarterly_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_periodicity_quarterly_short(inputs)
	return en_subscription_periodicity_quarterly_short(inputs)
});