/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Line_Unit_HourInputs */

const en_line_unit_hour = /** @type {(inputs: Line_Unit_HourInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hour`)
};

const fr_line_unit_hour = /** @type {(inputs: Line_Unit_HourInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`heure`)
};

/**
* | output |
* | --- |
* | "hour" |
*
* @param {Line_Unit_HourInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const line_unit_hour = /** @type {((inputs?: Line_Unit_HourInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Line_Unit_HourInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_line_unit_hour(inputs)
	return en_line_unit_hour(inputs)
});