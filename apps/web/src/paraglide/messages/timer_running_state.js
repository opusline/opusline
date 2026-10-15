/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Running_StateInputs */

const en_timer_running_state = /** @type {(inputs: Timer_Running_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tracking in progress`)
};

const fr_timer_running_state = /** @type {(inputs: Timer_Running_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivi en cours`)
};

/**
* | output |
* | --- |
* | "Tracking in progress" |
*
* @param {Timer_Running_StateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_running_state = /** @type {((inputs?: Timer_Running_StateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Running_StateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_running_state(inputs)
	return en_timer_running_state(inputs)
});