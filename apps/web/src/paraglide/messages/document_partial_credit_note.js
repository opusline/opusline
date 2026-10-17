/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Partial_Credit_NoteInputs */

const en_document_partial_credit_note = /** @type {(inputs: Document_Partial_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partial credit note`)
};

const fr_document_partial_credit_note = /** @type {(inputs: Document_Partial_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoir partiel`)
};

/**
* | output |
* | --- |
* | "Partial credit note" |
*
* @param {Document_Partial_Credit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_partial_credit_note = /** @type {((inputs?: Document_Partial_Credit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Partial_Credit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_partial_credit_note(inputs)
	return en_document_partial_credit_note(inputs)
});