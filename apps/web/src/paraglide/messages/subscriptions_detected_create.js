/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Detected_CreateInputs */

const en_subscriptions_detected_create = /** @type {(inputs: Subscriptions_Detected_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the subscription`)
};

const fr_subscriptions_detected_create = /** @type {(inputs: Subscriptions_Detected_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer l'abonnement`)
};

/**
* | output |
* | --- |
* | "Create the subscription" |
*
* @param {Subscriptions_Detected_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_detected_create = /** @type {((inputs?: Subscriptions_Detected_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Detected_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_detected_create(inputs)
	return en_subscriptions_detected_create(inputs)
});