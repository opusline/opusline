/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Line_Unit_FlatInputs */

const en_line_unit_flat = /** @type {(inputs: Line_Unit_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`flat fee`)
};

const fr_line_unit_flat = /** @type {(inputs: Line_Unit_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`forfait`)
};

/**
* | output |
* | --- |
* | "flat fee" |
*
* @param {Line_Unit_FlatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const line_unit_flat = /** @type {((inputs?: Line_Unit_FlatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Line_Unit_FlatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_line_unit_flat(inputs)
	return en_line_unit_flat(inputs)
});