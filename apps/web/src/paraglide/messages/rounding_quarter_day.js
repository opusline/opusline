/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rounding_Quarter_DayInputs */

const en_rounding_quarter_day = /** @type {(inputs: Rounding_Quarter_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0.25 d`)
};

const fr_rounding_quarter_day = /** @type {(inputs: Rounding_Quarter_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0,25 j`)
};

/**
* | output |
* | --- |
* | "0.25 d" |
*
* @param {Rounding_Quarter_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const rounding_quarter_day = /** @type {((inputs?: Rounding_Quarter_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rounding_Quarter_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_rounding_quarter_day(inputs)
	return en_rounding_quarter_day(inputs)
});