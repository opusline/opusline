/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rounding: NonNullable<unknown> }} Timer_Rounding_DeviationInputs */

const en_timer_rounding_deviation = /** @type {(inputs: Timer_Rounding_DeviationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`You are overriding this mission's ${i?.rounding} rounding, for this entry only.`)
};

const fr_timer_rounding_deviation = /** @type {(inputs: Timer_Rounding_DeviationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Vous dérogez à l'arrondi ${i?.rounding} de cette mission, pour cette entrée seulement.`)
};

/**
* | output |
* | --- |
* | "You are overriding this mission's {rounding} rounding, for this entry only." |
*
* @param {Timer_Rounding_DeviationInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_rounding_deviation = /** @type {((inputs: Timer_Rounding_DeviationInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Rounding_DeviationInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_rounding_deviation(inputs)
	return en_timer_rounding_deviation(inputs)
});