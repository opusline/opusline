/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscription_Status_PausedInputs */

const en_subscription_status_paused = /** @type {(inputs: Subscription_Status_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paused`)
};

const fr_subscription_status_paused = /** @type {(inputs: Subscription_Status_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En pause`)
};

/**
* | output |
* | --- |
* | "Paused" |
*
* @param {Subscription_Status_PausedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscription_status_paused = /** @type {((inputs?: Subscription_Status_PausedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscription_Status_PausedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscription_status_paused(inputs)
	return en_subscription_status_paused(inputs)
});