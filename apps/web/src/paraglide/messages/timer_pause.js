/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_PauseInputs */

const en_timer_pause = /** @type {(inputs: Timer_PauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pause`)
};

const fr_timer_pause = /** @type {(inputs: Timer_PauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mettre en pause`)
};

/**
* | output |
* | --- |
* | "Pause" |
*
* @param {Timer_PauseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_pause = /** @type {((inputs?: Timer_PauseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_PauseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_pause(inputs)
	return en_timer_pause(inputs)
});