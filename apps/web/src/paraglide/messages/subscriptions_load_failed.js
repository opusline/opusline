/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Load_FailedInputs */



/**
* | output |
* | --- |
* | "The subscriptions could not be loaded. Try again in a moment." |
*
* @param {Subscriptions_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_load_failed = /** @type {((inputs?: Subscriptions_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les abonnements n'ont pas pu être chargés. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The subscriptions could not be loaded. Try again in a moment.")
});