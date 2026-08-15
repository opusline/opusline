/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Timer_Measured_DurationInputs */

const en_timer_measured_duration = /** @type {(inputs: Timer_Measured_DurationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Measured duration: ${i?.duration}. Replace it with the time actually worked.`)
};

const fr_timer_measured_duration = /** @type {(inputs: Timer_Measured_DurationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Durée mesurée : ${i?.duration}. Remplacez-la par le temps réellement travaillé.`)
};

/**
* | output |
* | --- |
* | "Measured duration: {duration}. Replace it with the time actually worked." |
*
* @param {Timer_Measured_DurationInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_measured_duration = /** @type {((inputs: Timer_Measured_DurationInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Measured_DurationInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_measured_duration(inputs)
	return en_timer_measured_duration(inputs)
});