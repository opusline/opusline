/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Start_HintInputs */

const en_timer_start_hint = /** @type {(inputs: Timer_Start_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activity and rounding are asked for when you stop.`)
};

const fr_timer_start_hint = /** @type {(inputs: Timer_Start_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'activité et l'arrondi sont demandés à l'arrêt.`)
};

/**
* | output |
* | --- |
* | "Activity and rounding are asked for when you stop." |
*
* @param {Timer_Start_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_start_hint = /** @type {((inputs?: Timer_Start_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Start_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_start_hint(inputs)
	return en_timer_start_hint(inputs)
});