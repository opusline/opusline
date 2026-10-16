/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Free_LineInputs */

const en_editor_free_line = /** @type {(inputs: Editor_Free_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Free line`)
};

const fr_editor_free_line = /** @type {(inputs: Editor_Free_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ligne libre`)
};

/**
* | output |
* | --- |
* | "Free line" |
*
* @param {Editor_Free_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_free_line = /** @type {((inputs?: Editor_Free_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Free_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_free_line(inputs)
	return en_editor_free_line(inputs)
});