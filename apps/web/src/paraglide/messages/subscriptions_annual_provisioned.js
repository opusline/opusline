/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Subscriptions_Annual_ProvisionedInputs */

const en_subscriptions_annual_provisioned = /** @type {(inputs: Subscriptions_Annual_ProvisionedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / month set aside`)
};

const fr_subscriptions_annual_provisioned = /** @type {(inputs: Subscriptions_Annual_ProvisionedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / mois provisionnés`)
};

/**
* | output |
* | --- |
* | "{amount} / month set aside" |
*
* @param {Subscriptions_Annual_ProvisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_annual_provisioned = /** @type {((inputs: Subscriptions_Annual_ProvisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Annual_ProvisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_annual_provisioned(inputs)
	return en_subscriptions_annual_provisioned(inputs)
});