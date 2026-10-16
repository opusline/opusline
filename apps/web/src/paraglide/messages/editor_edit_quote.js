/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Edit_QuoteInputs */

const en_editor_edit_quote = /** @type {(inputs: Editor_Edit_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the draft quote`)
};

const fr_editor_edit_quote = /** @type {(inputs: Editor_Edit_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier le devis en brouillon`)
};

/**
* | output |
* | --- |
* | "Edit the draft quote" |
*
* @param {Editor_Edit_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_edit_quote = /** @type {((inputs?: Editor_Edit_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Edit_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_edit_quote(inputs)
	return en_editor_edit_quote(inputs)
});