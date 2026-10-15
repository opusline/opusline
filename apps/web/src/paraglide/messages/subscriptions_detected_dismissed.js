/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Detected_DismissedInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ignoré · ne sera plus proposé")
	return /** @type {LocalizedString} */ ("Ignored · it will not come up again")
});