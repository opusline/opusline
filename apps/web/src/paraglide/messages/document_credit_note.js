/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Credit_NoteInputs */

const en_document_credit_note = /** @type {(inputs: Document_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Credit note`)
};

const fr_document_credit_note = /** @type {(inputs: Document_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoir`)
};

/**
* | output |
* | --- |
* | "Credit note" |
*
* @param {Document_Credit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_credit_note = /** @type {((inputs?: Document_Credit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Credit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_credit_note(inputs)
	return en_document_credit_note(inputs)
});