/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ ht: NonNullable<unknown>, due: NonNullable<unknown> }} Document_Amount_Note_DueInputs */

const en_document_amount_note_due = /** @type {(inputs: Document_Amount_Note_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TTC · ${i?.ht} HT · due ${i?.due}`)
};

const fr_document_amount_note_due = /** @type {(inputs: Document_Amount_Note_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TTC · ${i?.ht} HT · échéance ${i?.due}`)
};

/**
* | output |
* | --- |
* | "TTC · {ht} HT · due {due}" |
*
* @param {Document_Amount_Note_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_amount_note_due = /** @type {((inputs: Document_Amount_Note_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Amount_Note_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_amount_note_due(inputs)
	return en_document_amount_note_due(inputs)
});