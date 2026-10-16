/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Line_Unit_UnitInputs */

const en_line_unit_unit = /** @type {(inputs: Line_Unit_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`unit`)
};

const fr_line_unit_unit = /** @type {(inputs: Line_Unit_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`unité`)
};

/**
* | output |
* | --- |
* | "unit" |
*
* @param {Line_Unit_UnitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const line_unit_unit = /** @type {((inputs?: Line_Unit_UnitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Line_Unit_UnitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_line_unit_unit(inputs)
	return en_line_unit_unit(inputs)
});