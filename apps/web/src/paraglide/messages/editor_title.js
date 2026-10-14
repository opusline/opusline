/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_TitleInputs */

const en_editor_title = /** @type {(inputs: Editor_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Title`)
};

const fr_editor_title = /** @type {(inputs: Editor_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Titre`)
};

/**
* | output |
* | --- |
* | "Title" |
*
* @param {Editor_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_title = /** @type {((inputs?: Editor_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_title(inputs)
	return en_editor_title(inputs)
});