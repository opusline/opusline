/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Rounding_LabelInputs */

const en_timer_rounding_label = /** @type {(inputs: Timer_Rounding_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rounding`)
};

const fr_timer_rounding_label = /** @type {(inputs: Timer_Rounding_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Arrondi`)
};

/**
* | output |
* | --- |
* | "Rounding" |
*
* @param {Timer_Rounding_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_rounding_label = /** @type {((inputs?: Timer_Rounding_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Rounding_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_rounding_label(inputs)
	return en_timer_rounding_label(inputs)
});