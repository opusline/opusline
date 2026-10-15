/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Start_ButtonInputs */

const en_timer_start_button = /** @type {(inputs: Timer_Start_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start tracking`)
};

const fr_timer_start_button = /** @type {(inputs: Timer_Start_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Démarrer un suivi`)
};

/**
* | output |
* | --- |
* | "Start tracking" |
*
* @param {Timer_Start_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_start_button = /** @type {((inputs?: Timer_Start_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Start_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_start_button(inputs)
	return en_timer_start_button(inputs)
});