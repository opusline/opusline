/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Credit_NotesInputs */

const en_editor_credit_notes = /** @type {(inputs: Editor_Credit_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Credit notes to deduct`)
};

const fr_editor_credit_notes = /** @type {(inputs: Editor_Credit_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoirs à déduire`)
};

/**
* | output |
* | --- |
* | "Credit notes to deduct" |
*
* @param {Editor_Credit_NotesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_credit_notes = /** @type {((inputs?: Editor_Credit_NotesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Credit_NotesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_credit_notes(inputs)
	return en_editor_credit_notes(inputs)
});