/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Annual_Not_ProvisionedInputs */

const en_subscriptions_annual_not_provisioned = /** @type {(inputs: Subscriptions_Annual_Not_ProvisionedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not set aside`)
};

const fr_subscriptions_annual_not_provisioned = /** @type {(inputs: Subscriptions_Annual_Not_ProvisionedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`non provisionné`)
};

/**
* | output |
* | --- |
* | "not set aside" |
*
* @param {Subscriptions_Annual_Not_ProvisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_annual_not_provisioned = /** @type {((inputs?: Subscriptions_Annual_Not_ProvisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Annual_Not_ProvisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_annual_not_provisioned(inputs)
	return en_subscriptions_annual_not_provisioned(inputs)
});