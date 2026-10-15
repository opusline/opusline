/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Chip_PausedInputs */

const en_timer_chip_paused = /** @type {(inputs: Timer_Chip_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paused`)
};

const fr_timer_chip_paused = /** @type {(inputs: Timer_Chip_PausedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En pause`)
};

/**
* | output |
* | --- |
* | "Paused" |
*
* @param {Timer_Chip_PausedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_chip_paused = /** @type {((inputs?: Timer_Chip_PausedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Chip_PausedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_chip_paused(inputs)
	return en_timer_chip_paused(inputs)
});