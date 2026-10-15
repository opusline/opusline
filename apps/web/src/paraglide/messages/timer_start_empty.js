/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Start_EmptyInputs */

const en_timer_start_empty = /** @type {(inputs: Timer_Start_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a mission first — it carries the rate.`)
};

const fr_timer_start_empty = /** @type {(inputs: Timer_Start_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez d'abord une mission — c'est elle qui porte le tarif.`)
};

/**
* | output |
* | --- |
* | "Create a mission first — it carries the rate." |
*
* @param {Timer_Start_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_start_empty = /** @type {((inputs?: Timer_Start_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Start_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_start_empty(inputs)
	return en_timer_start_empty(inputs)
});