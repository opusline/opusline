/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Editor_Number_NoteInputs */

const en_editor_number_note = /** @type {(inputs: Editor_Number_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Number ${i?.number} will be assigned on validation. The sequence is continuous and chronological, with no gap.`)
};

const fr_editor_number_note = /** @type {(inputs: Editor_Number_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le numéro ${i?.number} sera attribué à la validation. La numérotation est continue et chronologique, sans trou.`)
};

/**
* | output |
* | --- |
* | "Number {number} will be assigned on validation. The sequence is continuous and chronological, with no gap." |
*
* @param {Editor_Number_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_number_note = /** @type {((inputs: Editor_Number_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Number_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_number_note(inputs)
	return en_editor_number_note(inputs)
});