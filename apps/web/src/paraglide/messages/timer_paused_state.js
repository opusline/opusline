/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Paused_StateInputs */

const en_timer_paused_state = /** @type {(inputs: Timer_Paused_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tracking paused`)
};

const fr_timer_paused_state = /** @type {(inputs: Timer_Paused_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivi en pause`)
};

/**
* | output |
* | --- |
* | "Tracking paused" |
*
* @param {Timer_Paused_StateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_paused_state = /** @type {((inputs?: Timer_Paused_StateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Paused_StateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_paused_state(inputs)
	return en_timer_paused_state(inputs)
});