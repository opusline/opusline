/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Upcoming_Provision_TailInputs */

const en_subscriptions_upcoming_provision_tail = /** @type {(inputs: Subscriptions_Upcoming_Provision_TailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`takes the provisions into account.`)
};

const fr_subscriptions_upcoming_provision_tail = /** @type {(inputs: Subscriptions_Upcoming_Provision_TailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`tient compte des provisions.`)
};

/**
* | output |
* | --- |
* | "takes the provisions into account." |
*
* @param {Subscriptions_Upcoming_Provision_TailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_provision_tail = /** @type {((inputs?: Subscriptions_Upcoming_Provision_TailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_Provision_TailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_provision_tail(inputs)
	return en_subscriptions_upcoming_provision_tail(inputs)
});