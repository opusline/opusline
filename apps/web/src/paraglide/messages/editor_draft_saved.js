/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Draft_SavedInputs */

const en_editor_draft_saved = /** @type {(inputs: Editor_Draft_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft saved`)
};

const fr_editor_draft_saved = /** @type {(inputs: Editor_Draft_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillon enregistré`)
};

/**
* | output |
* | --- |
* | "Draft saved" |
*
* @param {Editor_Draft_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_draft_saved = /** @type {((inputs?: Editor_Draft_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Draft_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_draft_saved(inputs)
	return en_editor_draft_saved(inputs)
});