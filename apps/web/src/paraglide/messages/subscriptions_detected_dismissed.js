/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Detected_DismissedInputs */

const en_subscriptions_detected_dismissed = /** @type {(inputs: Subscriptions_Detected_DismissedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ignored · it will not come up again`)
};

const fr_subscriptions_detected_dismissed = /** @type {(inputs: Subscriptions_Detected_DismissedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ignoré · ne sera plus proposé`)
};

/**
* | output |
* | --- |
* | "Ignored · it will not come up again" |
*
* @param {Subscriptions_Detected_DismissedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_detected_dismissed = /** @type {((inputs?: Subscriptions_Detected_DismissedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Detected_DismissedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_detected_dismissed(inputs)
	return en_subscriptions_detected_dismissed(inputs)
});