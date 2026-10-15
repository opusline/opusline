/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Keep_IdleInputs */

const en_timer_keep_idle = /** @type {(inputs: Timer_Keep_IdleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keep`)
};

const fr_timer_keep_idle = /** @type {(inputs: Timer_Keep_IdleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Garder`)
};

/**
* | output |
* | --- |
* | "Keep" |
*
* @param {Timer_Keep_IdleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_keep_idle = /** @type {((inputs?: Timer_Keep_IdleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Keep_IdleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_keep_idle(inputs)
	return en_timer_keep_idle(inputs)
});