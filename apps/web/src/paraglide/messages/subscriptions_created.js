/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_CreatedInputs */

const en_subscriptions_created = /** @type {(inputs: Subscriptions_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscription added`)
};

const fr_subscriptions_created = /** @type {(inputs: Subscriptions_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnement ajouté`)
};

/**
* | output |
* | --- |
* | "Subscription added" |
*
* @param {Subscriptions_CreatedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_created = /** @type {((inputs?: Subscriptions_CreatedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_CreatedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_created(inputs)
	return en_subscriptions_created(inputs)
});