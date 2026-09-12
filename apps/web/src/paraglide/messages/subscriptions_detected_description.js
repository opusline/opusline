/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Detected_DescriptionInputs */

const en_subscriptions_detected_description = /** @type {(inputs: Subscriptions_Detected_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Found on the compte pro`)
};

const fr_subscriptions_detected_description = /** @type {(inputs: Subscriptions_Detected_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détecté · compte pro`)
};

/**
* | output |
* | --- |
* | "Found on the compte pro" |
*
* @param {Subscriptions_Detected_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_detected_description = /** @type {((inputs?: Subscriptions_Detected_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Detected_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_detected_description(inputs)
	return en_subscriptions_detected_description(inputs)
});