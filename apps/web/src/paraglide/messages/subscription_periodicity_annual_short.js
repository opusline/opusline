/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Periodicity_Annual_ShortInputs */

const en_subscription_periodicity_annual_short = /** @type {(inputs: Subscription_Periodicity_Annual_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annual`)
};

const fr_subscription_periodicity_annual_short = /** @type {(inputs: Subscription_Periodicity_Annual_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuel`)
};

/**
* | output |
* | --- |
* | "Annual" |
*
* @param {Subscription_Periodicity_Annual_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_periodicity_annual_short = /** @type {((inputs?: Subscription_Periodicity_Annual_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Periodicity_Annual_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_periodicity_annual_short(inputs)
	return en_subscription_periodicity_annual_short(inputs)
});