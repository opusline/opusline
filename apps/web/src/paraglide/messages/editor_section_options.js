/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Section_OptionsInputs */

const en_editor_section_options = /** @type {(inputs: Editor_Section_OptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Options`)
};

const fr_editor_section_options = /** @type {(inputs: Editor_Section_OptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Options`)
};

/**
* | output |
* | --- |
* | "Options" |
*
* @param {Editor_Section_OptionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_section_options = /** @type {((inputs?: Editor_Section_OptionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Section_OptionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_section_options(inputs)
	return en_editor_section_options(inputs)
});