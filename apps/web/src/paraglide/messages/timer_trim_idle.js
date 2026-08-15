/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ minutes: NonNullable<unknown> }} Timer_Trim_IdleInputs */

const en_timer_trim_idle = /** @type {(inputs: Timer_Trim_IdleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remove ${i?.minutes} min`)
};

const fr_timer_trim_idle = /** @type {(inputs: Timer_Trim_IdleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Retirer ${i?.minutes} min`)
};

/**
* | output |
* | --- |
* | "Remove {minutes} min" |
*
* @param {Timer_Trim_IdleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_trim_idle = /** @type {((inputs: Timer_Trim_IdleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Trim_IdleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_trim_idle(inputs)
	return en_timer_trim_idle(inputs)
});