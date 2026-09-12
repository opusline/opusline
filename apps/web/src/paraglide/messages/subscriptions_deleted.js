/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_DeletedInputs */

const en_subscriptions_deleted = /** @type {(inputs: Subscriptions_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscription deleted`)
};

const fr_subscriptions_deleted = /** @type {(inputs: Subscriptions_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnement supprimé`)
};

/**
* | output |
* | --- |
* | "Subscription deleted" |
*
* @param {Subscriptions_DeletedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_deleted = /** @type {((inputs?: Subscriptions_DeletedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_DeletedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_deleted(inputs)
	return en_subscriptions_deleted(inputs)
});