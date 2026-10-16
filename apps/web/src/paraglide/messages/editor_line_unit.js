/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Line_UnitInputs */

const en_editor_line_unit = /** @type {(inputs: Editor_Line_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit`)
};

const fr_editor_line_unit = /** @type {(inputs: Editor_Line_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unité`)
};

/**
* | output |
* | --- |
* | "Unit" |
*
* @param {Editor_Line_UnitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_line_unit = /** @type {((inputs?: Editor_Line_UnitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Line_UnitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_line_unit(inputs)
	return en_editor_line_unit(inputs)
});