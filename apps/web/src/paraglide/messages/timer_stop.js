/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_StopInputs */

const en_timer_stop = /** @type {(inputs: Timer_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop`)
};

const fr_timer_stop = /** @type {(inputs: Timer_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Arrêter`)
};

/**
* | output |
* | --- |
* | "Stop" |
*
* @param {Timer_StopInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_stop = /** @type {((inputs?: Timer_StopInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_StopInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_stop(inputs)
	return en_timer_stop(inputs)
});