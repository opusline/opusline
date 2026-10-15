/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_ProvisionInputs */

const en_subscriptions_provision = /** @type {(inputs: Subscriptions_ProvisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set aside monthly`)
};

const fr_subscriptions_provision = /** @type {(inputs: Subscriptions_ProvisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provisionner mensuellement`)
};

/**
* | output |
* | --- |
* | "Set aside monthly" |
*
* @param {Subscriptions_ProvisionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_provision = /** @type {((inputs?: Subscriptions_ProvisionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_ProvisionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_provision(inputs)
	return en_subscriptions_provision(inputs)
});