/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Stop_TitleInputs */

const en_timer_stop_title = /** @type {(inputs: Timer_Stop_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save the entry`)
};

const fr_timer_stop_title = /** @type {(inputs: Timer_Stop_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer l'entrée`)
};

/**
* | output |
* | --- |
* | "Save the entry" |
*
* @param {Timer_Stop_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_stop_title = /** @type {((inputs?: Timer_Stop_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Stop_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_stop_title(inputs)
	return en_timer_stop_title(inputs)
});