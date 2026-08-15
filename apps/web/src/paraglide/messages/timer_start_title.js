/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Start_TitleInputs */

const en_timer_start_title = /** @type {(inputs: Timer_Start_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Track which mission?`)
};

const fr_timer_start_title = /** @type {(inputs: Timer_Start_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivre quelle mission ?`)
};

/**
* | output |
* | --- |
* | "Track which mission?" |
*
* @param {Timer_Start_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_start_title = /** @type {((inputs?: Timer_Start_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Start_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_start_title(inputs)
	return en_timer_start_title(inputs)
});