/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Save_DraftInputs */

const en_editor_save_draft = /** @type {(inputs: Editor_Save_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save the draft`)
};

const fr_editor_save_draft = /** @type {(inputs: Editor_Save_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer le brouillon`)
};

/**
* | output |
* | --- |
* | "Save the draft" |
*
* @param {Editor_Save_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_save_draft = /** @type {((inputs?: Editor_Save_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Save_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_save_draft(inputs)
	return en_editor_save_draft(inputs)
});