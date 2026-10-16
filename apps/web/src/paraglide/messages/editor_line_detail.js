/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Line_DetailInputs */

const en_editor_line_detail = /** @type {(inputs: Editor_Line_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Detail · printed under the line`)
};

const fr_editor_line_detail = /** @type {(inputs: Editor_Line_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détail · repris sous la ligne`)
};

/**
* | output |
* | --- |
* | "Detail · printed under the line" |
*
* @param {Editor_Line_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_line_detail = /** @type {((inputs?: Editor_Line_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Line_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_line_detail(inputs)
	return en_editor_line_detail(inputs)
});