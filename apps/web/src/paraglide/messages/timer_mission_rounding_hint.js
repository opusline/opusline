/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rounding: NonNullable<unknown> }} Timer_Mission_Rounding_HintInputs */

const en_timer_mission_rounding_hint = /** @type {(inputs: Timer_Mission_Rounding_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`mission: ${i?.rounding}`)
};

const fr_timer_mission_rounding_hint = /** @type {(inputs: Timer_Mission_Rounding_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`mission : ${i?.rounding}`)
};

/**
* | output |
* | --- |
* | "mission: {rounding}" |
*
* @param {Timer_Mission_Rounding_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_mission_rounding_hint = /** @type {((inputs: Timer_Mission_Rounding_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Mission_Rounding_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_mission_rounding_hint(inputs)
	return en_timer_mission_rounding_hint(inputs)
});