/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Upcoming_Provision_LinkInputs */

const en_subscriptions_upcoming_provision_link = /** @type {(inputs: Subscriptions_Upcoming_Provision_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Safe to transfer`)
};

const fr_subscriptions_upcoming_provision_link = /** @type {(inputs: Subscriptions_Upcoming_Provision_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Virable en sécurité`)
};

/**
* | output |
* | --- |
* | "Safe to transfer" |
*
* @param {Subscriptions_Upcoming_Provision_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_provision_link = /** @type {((inputs?: Subscriptions_Upcoming_Provision_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_Provision_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_provision_link(inputs)
	return en_subscriptions_upcoming_provision_link(inputs)
});