/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Line_Unit_DayInputs */

const en_line_unit_day = /** @type {(inputs: Line_Unit_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`day`)
};

const fr_line_unit_day = /** @type {(inputs: Line_Unit_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`jour`)
};

/**
* | output |
* | --- |
* | "day" |
*
* @param {Line_Unit_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const line_unit_day = /** @type {((inputs?: Line_Unit_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Line_Unit_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_line_unit_day(inputs)
	return en_line_unit_day(inputs)
});