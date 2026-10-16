/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_PreviewInputs */

const en_editor_preview = /** @type {(inputs: Editor_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Live preview`)
};

const fr_editor_preview = /** @type {(inputs: Editor_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu en direct`)
};

/**
* | output |
* | --- |
* | "Live preview" |
*
* @param {Editor_PreviewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_preview = /** @type {((inputs?: Editor_PreviewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_PreviewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_preview(inputs)
	return en_editor_preview(inputs)
});