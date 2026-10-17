/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Cancel_By_Credit_NoteInputs */

const en_document_cancel_by_credit_note = /** @type {(inputs: Document_Cancel_By_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancel with a credit note`)
};

const fr_document_cancel_by_credit_note = /** @type {(inputs: Document_Cancel_By_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuler par un avoir`)
};

/**
* | output |
* | --- |
* | "Cancel with a credit note" |
*
* @param {Document_Cancel_By_Credit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_cancel_by_credit_note = /** @type {((inputs?: Document_Cancel_By_Credit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Cancel_By_Credit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_cancel_by_credit_note(inputs)
	return en_document_cancel_by_credit_note(inputs)
});