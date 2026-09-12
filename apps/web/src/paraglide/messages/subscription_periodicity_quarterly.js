/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Periodicity_QuarterlyInputs */

const en_subscription_periodicity_quarterly = /** @type {(inputs: Subscription_Periodicity_QuarterlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`quarterly`)
};

const fr_subscription_periodicity_quarterly = /** @type {(inputs: Subscription_Periodicity_QuarterlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`trimestriel`)
};

/**
* | output |
* | --- |
* | "quarterly" |
*
* @param {Subscription_Periodicity_QuarterlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_periodicity_quarterly = /** @type {((inputs?: Subscription_Periodicity_QuarterlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Periodicity_QuarterlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_periodicity_quarterly(inputs)
	return en_subscription_periodicity_quarterly(inputs)
});