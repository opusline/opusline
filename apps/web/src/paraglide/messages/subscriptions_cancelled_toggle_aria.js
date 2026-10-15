/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Cancelled_Toggle_AriaInputs */



/**
* | output |
* | --- |
* | "Show cancelled subscriptions" |
*
* @param {Subscriptions_Cancelled_Toggle_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_cancelled_toggle_aria = /** @type {((inputs?: Subscriptions_Cancelled_Toggle_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Cancelled_Toggle_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Afficher les abonnements résiliés")
	return /** @type {LocalizedString} */ ("Show cancelled subscriptions")
});