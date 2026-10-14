/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Line_LabelInputs */

const en_editor_line_label = /** @type {(inputs: Editor_Line_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const fr_editor_line_label = /** @type {(inputs: Editor_Line_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désignation`)
};

/**
* | output |
* | --- |
* | "Name" |
*
* @param {Editor_Line_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_line_label = /** @type {((inputs?: Editor_Line_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Line_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_line_label(inputs)
	return en_editor_line_label(inputs)
});