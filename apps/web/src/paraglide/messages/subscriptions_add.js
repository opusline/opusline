/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_AddInputs */

const en_subscriptions_add = /** @type {(inputs: Subscriptions_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a subscription`)
};

const fr_subscriptions_add = /** @type {(inputs: Subscriptions_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un abonnement`)
};

/**
* | output |
* | --- |
* | "Add a subscription" |
*
* @param {Subscriptions_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_add = /** @type {((inputs?: Subscriptions_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_add(inputs)
	return en_subscriptions_add(inputs)
});