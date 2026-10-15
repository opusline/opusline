/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rounding_Half_DayInputs */

const en_rounding_half_day = /** @type {(inputs: Rounding_Half_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0.5 d`)
};

const fr_rounding_half_day = /** @type {(inputs: Rounding_Half_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0,5 j`)
};

/**
* | output |
* | --- |
* | "0.5 d" |
*
* @param {Rounding_Half_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const rounding_half_day = /** @type {((inputs?: Rounding_Half_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rounding_Half_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_rounding_half_day(inputs)
	return en_rounding_half_day(inputs)
});