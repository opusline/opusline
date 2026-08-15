/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Exact_Duration_HintInputs */

const en_timer_exact_duration_hint = /** @type {(inputs: Timer_Exact_Duration_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`h:mm — exact duration`)
};

const fr_timer_exact_duration_hint = /** @type {(inputs: Timer_Exact_Duration_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`h:mm — durée exacte`)
};

/**
* | output |
* | --- |
* | "h:mm — exact duration" |
*
* @param {Timer_Exact_Duration_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_exact_duration_hint = /** @type {((inputs?: Timer_Exact_Duration_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Exact_Duration_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_exact_duration_hint(inputs)
	return en_timer_exact_duration_hint(inputs)
});