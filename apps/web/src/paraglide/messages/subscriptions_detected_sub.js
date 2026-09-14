/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ months: NonNullable<unknown> }} Subscriptions_Detected_SubInputs */

const en_subscriptions_detected_sub = /** @type {(inputs: Subscriptions_Detected_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Compte pro · ${i?.months} · no subscription matches`)
};

const fr_subscriptions_detected_sub = /** @type {(inputs: Subscriptions_Detected_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Compte pro · ${i?.months} · aucun abonnement ne correspond`)
};

/**
* | output |
* | --- |
* | "Compte pro · {months} · no subscription matches" |
*
* @param {Subscriptions_Detected_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_detected_sub = /** @type {((inputs: Subscriptions_Detected_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Detected_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_detected_sub(inputs)
	return en_subscriptions_detected_sub(inputs)
});