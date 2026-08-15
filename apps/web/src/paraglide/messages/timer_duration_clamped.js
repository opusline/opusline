/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ minutes: NonNullable<unknown> }} Timer_Duration_ClampedInputs */

const en_timer_duration_clamped = /** @type {(inputs: Timer_Duration_ClampedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`An entry cannot exceed 24 h: ${i?.minutes} min of this tracking will not be saved.`)
};

const fr_timer_duration_clamped = /** @type {(inputs: Timer_Duration_ClampedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Une entrée ne peut pas dépasser 24 h : ${i?.minutes} min de ce suivi ne seront pas enregistrées.`)
};

/**
* | output |
* | --- |
* | "An entry cannot exceed 24 h: {minutes} min of this tracking will not be saved." |
*
* @param {Timer_Duration_ClampedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_duration_clamped = /** @type {((inputs: Timer_Duration_ClampedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Duration_ClampedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_duration_clamped(inputs)
	return en_timer_duration_clamped(inputs)
});