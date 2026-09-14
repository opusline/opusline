/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Periodicity_AnnualInputs */

const en_subscription_periodicity_annual = /** @type {(inputs: Subscription_Periodicity_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`annual`)
};

const fr_subscription_periodicity_annual = /** @type {(inputs: Subscription_Periodicity_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`annuel`)
};

/**
* | output |
* | --- |
* | "annual" |
*
* @param {Subscription_Periodicity_AnnualInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_periodicity_annual = /** @type {((inputs?: Subscription_Periodicity_AnnualInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Periodicity_AnnualInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_periodicity_annual(inputs)
	return en_subscription_periodicity_annual(inputs)
});