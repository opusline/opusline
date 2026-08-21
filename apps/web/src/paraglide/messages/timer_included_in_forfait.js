/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Included_In_ForfaitInputs */

const en_timer_included_in_forfait = /** @type {(inputs: Timer_Included_In_ForfaitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`included in the fixed price`)
};

const fr_timer_included_in_forfait = /** @type {(inputs: Timer_Included_In_ForfaitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`compris dans le forfait`)
};

/**
* | output |
* | --- |
* | "included in the fixed price" |
*
* @param {Timer_Included_In_ForfaitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_included_in_forfait = /** @type {((inputs?: Timer_Included_In_ForfaitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Included_In_ForfaitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_included_in_forfait(inputs)
	return en_timer_included_in_forfait(inputs)
});