/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Long_Run_KeepInputs */

const en_timer_long_run_keep = /** @type {(inputs: Timer_Long_Run_KeepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`It's expected`)
};

const fr_timer_long_run_keep = /** @type {(inputs: Timer_Long_Run_KeepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`C'est normal`)
};

/**
* | output |
* | --- |
* | "It's expected" |
*
* @param {Timer_Long_Run_KeepInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_long_run_keep = /** @type {((inputs?: Timer_Long_Run_KeepInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Long_Run_KeepInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_long_run_keep(inputs)
	return en_timer_long_run_keep(inputs)
});