/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Detected_DismissInputs */

const en_subscriptions_detected_dismiss = /** @type {(inputs: Subscriptions_Detected_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ignore`)
};

const fr_subscriptions_detected_dismiss = /** @type {(inputs: Subscriptions_Detected_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ignorer`)
};

/**
* | output |
* | --- |
* | "Ignore" |
*
* @param {Subscriptions_Detected_DismissInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_detected_dismiss = /** @type {((inputs?: Subscriptions_Detected_DismissInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Detected_DismissInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_detected_dismiss(inputs)
	return en_subscriptions_detected_dismiss(inputs)
});