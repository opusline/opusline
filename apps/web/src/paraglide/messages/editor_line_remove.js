/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Editor_Line_RemoveInputs */

const en_editor_line_remove = /** @type {(inputs: Editor_Line_RemoveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remove line ${i?.number}`)
};

const fr_editor_line_remove = /** @type {(inputs: Editor_Line_RemoveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Retirer la ligne ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Remove line {number}" |
*
* @param {Editor_Line_RemoveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_line_remove = /** @type {((inputs: Editor_Line_RemoveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Line_RemoveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_line_remove(inputs)
	return en_editor_line_remove(inputs)
});