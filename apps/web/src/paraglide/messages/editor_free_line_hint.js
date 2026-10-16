/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Free_Line_HintInputs */

const en_editor_free_line_hint = /** @type {(inputs: Editor_Free_Line_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Typed by hand, for this document only`)
};

const fr_editor_free_line_hint = /** @type {(inputs: Editor_Free_Line_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisie à la main, pour ce document seulement`)
};

/**
* | output |
* | --- |
* | "Typed by hand, for this document only" |
*
* @param {Editor_Free_Line_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_free_line_hint = /** @type {((inputs?: Editor_Free_Line_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Free_Line_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_free_line_hint(inputs)
	return en_editor_free_line_hint(inputs)
});