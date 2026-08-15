/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ minutes: NonNullable<unknown> }} Timer_Idle_DetectedInputs */

const en_timer_idle_detected = /** @type {(inputs: Timer_Idle_DetectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Idle time detected: ${i?.minutes} min without activity.`)
};

const fr_timer_idle_detected = /** @type {(inputs: Timer_Idle_DetectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Inactivité détectée : ${i?.minutes} min sans activité.`)
};

/**
* | output |
* | --- |
* | "Idle time detected: {minutes} min without activity." |
*
* @param {Timer_Idle_DetectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_idle_detected = /** @type {((inputs: Timer_Idle_DetectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Idle_DetectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_idle_detected(inputs)
	return en_timer_idle_detected(inputs)
});