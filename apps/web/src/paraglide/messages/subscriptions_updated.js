/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_UpdatedInputs */

const en_subscriptions_updated = /** @type {(inputs: Subscriptions_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscription updated`)
};

const fr_subscriptions_updated = /** @type {(inputs: Subscriptions_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnement modifié`)
};

/**
* | output |
* | --- |
* | "Subscription updated" |
*
* @param {Subscriptions_UpdatedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_updated = /** @type {((inputs?: Subscriptions_UpdatedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_UpdatedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_updated(inputs)
	return en_subscriptions_updated(inputs)
});