/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ ht: NonNullable<unknown> }} Document_Amount_NoteInputs */

const en_document_amount_note = /** @type {(inputs: Document_Amount_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`incl. VAT · ${i?.ht} excl. VAT`)
};

const fr_document_amount_note = /** @type {(inputs: Document_Amount_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TTC · ${i?.ht} HT`)
};

/**
* | output |
* | --- |
* | "incl. VAT · {ht} excl. VAT" |
*
* @param {Document_Amount_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_amount_note = /** @type {((inputs: Document_Amount_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Amount_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_amount_note(inputs)
	return en_document_amount_note(inputs)
});