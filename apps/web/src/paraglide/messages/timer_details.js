/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_DetailsInputs */

const en_timer_details = /** @type {(inputs: Timer_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Details`)
};

const fr_timer_details = /** @type {(inputs: Timer_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détails`)
};

/**
* | output |
* | --- |
* | "Details" |
*
* @param {Timer_DetailsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_details = /** @type {((inputs?: Timer_DetailsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_DetailsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_details(inputs)
	return en_timer_details(inputs)
});