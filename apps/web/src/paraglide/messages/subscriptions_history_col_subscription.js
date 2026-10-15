/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_History_Col_SubscriptionInputs */

const en_subscriptions_history_col_subscription = /** @type {(inputs: Subscriptions_History_Col_SubscriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscription`)
};

const fr_subscriptions_history_col_subscription = /** @type {(inputs: Subscriptions_History_Col_SubscriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnement`)
};

/**
* | output |
* | --- |
* | "Subscription" |
*
* @param {Subscriptions_History_Col_SubscriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_history_col_subscription = /** @type {((inputs?: Subscriptions_History_Col_SubscriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_History_Col_SubscriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_history_col_subscription(inputs)
	return en_subscriptions_history_col_subscription(inputs)
});