/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_DescriptionInputs */

const en_editor_description = /** @type {(inputs: Editor_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Description · optional`)
};

const fr_editor_description = /** @type {(inputs: Editor_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Description · facultatif`)
};

/**
* | output |
* | --- |
* | "Description · optional" |
*
* @param {Editor_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_description = /** @type {((inputs?: Editor_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_description(inputs)
	return en_editor_description(inputs)
});