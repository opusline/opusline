/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Subscriptions_Upcoming_ProvisionInputs */

const en_subscriptions_upcoming_provision = /** @type {(inputs: Subscriptions_Upcoming_ProvisionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`monthly provision · ${i?.amount}`)
};

const fr_subscriptions_upcoming_provision = /** @type {(inputs: Subscriptions_Upcoming_ProvisionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`provision mensuelle · ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "monthly provision · {amount}" |
*
* @param {Subscriptions_Upcoming_ProvisionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_provision = /** @type {((inputs: Subscriptions_Upcoming_ProvisionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_ProvisionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_provision(inputs)
	return en_subscriptions_upcoming_provision(inputs)
});