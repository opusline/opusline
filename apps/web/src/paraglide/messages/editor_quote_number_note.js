/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Editor_Quote_Number_NoteInputs */

const en_editor_quote_number_note = /** @type {(inputs: Editor_Quote_Number_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Number ${i?.number} will be assigned on validation, from the quotes' own series, continuous and chronological.`)
};

const fr_editor_quote_number_note = /** @type {(inputs: Editor_Quote_Number_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le numéro ${i?.number} sera attribué à la validation, dans la série propre aux devis, continue et chronologique.`)
};

/**
* | output |
* | --- |
* | "Number {number} will be assigned on validation, from the quotes' own series, continuous and chronological." |
*
* @param {Editor_Quote_Number_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_quote_number_note = /** @type {((inputs: Editor_Quote_Number_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Quote_Number_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_quote_number_note(inputs)
	return en_editor_quote_number_note(inputs)
});