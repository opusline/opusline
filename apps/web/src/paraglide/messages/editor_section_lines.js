/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Section_LinesInputs */

const en_editor_section_lines = /** @type {(inputs: Editor_Section_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines`)
};

const fr_editor_section_lines = /** @type {(inputs: Editor_Section_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lignes`)
};

/**
* | output |
* | --- |
* | "Lines" |
*
* @param {Editor_Section_LinesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_section_lines = /** @type {((inputs?: Editor_Section_LinesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Section_LinesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_section_lines(inputs)
	return en_editor_section_lines(inputs)
});