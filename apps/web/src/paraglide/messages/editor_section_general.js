/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Section_GeneralInputs */

const en_editor_section_general = /** @type {(inputs: Editor_Section_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`General`)
};

const fr_editor_section_general = /** @type {(inputs: Editor_Section_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Général`)
};

/**
* | output |
* | --- |
* | "General" |
*
* @param {Editor_Section_GeneralInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_section_general = /** @type {((inputs?: Editor_Section_GeneralInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Section_GeneralInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_section_general(inputs)
	return en_editor_section_general(inputs)
});