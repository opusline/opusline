/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ ht: NonNullable<unknown> }} Quote_Document_Amount_NoteInputs */

const en_quote_document_amount_note = /** @type {(inputs: Quote_Document_Amount_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TTC · ${i?.ht} HT`)
};

const fr_quote_document_amount_note = /** @type {(inputs: Quote_Document_Amount_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TTC · ${i?.ht} HT`)
};

/**
* | output |
* | --- |
* | "TTC · {ht} HT" |
*
* @param {Quote_Document_Amount_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_amount_note = /** @type {((inputs: Quote_Document_Amount_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_Amount_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_amount_note(inputs)
	return en_quote_document_amount_note(inputs)
});