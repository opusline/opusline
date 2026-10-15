/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Pause_ShortInputs */

const en_timer_pause_short = /** @type {(inputs: Timer_Pause_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pause`)
};

const fr_timer_pause_short = /** @type {(inputs: Timer_Pause_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pause`)
};

/**
* | output |
* | --- |
* | "Pause" |
*
* @param {Timer_Pause_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_pause_short = /** @type {((inputs?: Timer_Pause_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Pause_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_pause_short(inputs)
	return en_timer_pause_short(inputs)
});