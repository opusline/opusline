/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Action_FailedInputs */



/**
* | output |
* | --- |
* | "The subscription could not be updated. Try again in a moment." |
*
* @param {Subscriptions_Action_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_action_failed = /** @type {((inputs?: Subscriptions_Action_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Action_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("L'abonnement n'a pas pu être mis à jour. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The subscription could not be updated. Try again in a moment.")
});