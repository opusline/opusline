/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Exact_Duration_LabelInputs */

const en_timer_exact_duration_label = /** @type {(inputs: Timer_Exact_Duration_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time actually worked`)
};

const fr_timer_exact_duration_label = /** @type {(inputs: Timer_Exact_Duration_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée réellement travaillée`)
};

/**
* | output |
* | --- |
* | "Time actually worked" |
*
* @param {Timer_Exact_Duration_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_exact_duration_label = /** @type {((inputs?: Timer_Exact_Duration_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Exact_Duration_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_exact_duration_label(inputs)
	return en_timer_exact_duration_label(inputs)
});