/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Upcoming_Provision_LinkInputs */



/**
* | output |
* | --- |
* | "Safe to transfer →" |
*
* @param {Subscriptions_Upcoming_Provision_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_provision_link = /** @type {((inputs?: Subscriptions_Upcoming_Provision_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_Provision_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Virable en sécurité →")
	return /** @type {LocalizedString} */ ("Safe to transfer →")
});