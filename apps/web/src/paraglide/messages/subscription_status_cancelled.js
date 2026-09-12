/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Status_CancelledInputs */

const en_subscription_status_cancelled = /** @type {(inputs: Subscription_Status_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancelled`)
};

const fr_subscription_status_cancelled = /** @type {(inputs: Subscription_Status_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Résilié`)
};

/**
* | output |
* | --- |
* | "Cancelled" |
*
* @param {Subscription_Status_CancelledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_status_cancelled = /** @type {((inputs?: Subscription_Status_CancelledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Status_CancelledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_status_cancelled(inputs)
	return en_subscription_status_cancelled(inputs)
});