/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Long_Run_StopInputs */

const en_timer_long_run_stop = /** @type {(inputs: Timer_Long_Run_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop and correct the duration`)
};

const fr_timer_long_run_stop = /** @type {(inputs: Timer_Long_Run_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Arrêter et corriger la durée`)
};

/**
* | output |
* | --- |
* | "Stop and correct the duration" |
*
* @param {Timer_Long_Run_StopInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_long_run_stop = /** @type {((inputs?: Timer_Long_Run_StopInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Long_Run_StopInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_long_run_stop(inputs)
	return en_timer_long_run_stop(inputs)
});