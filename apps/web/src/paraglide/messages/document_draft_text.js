/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Draft_TextInputs */

const en_document_draft_text = /** @type {(inputs: Document_Draft_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No number yet: it is assigned on validation, in chronological order. The client receives nothing until the invoice is validated.`)
};

const fr_document_draft_text = /** @type {(inputs: Document_Draft_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encore de numéro : il est attribué à la validation, dans l'ordre chronologique. Le client ne reçoit rien tant que la facture n'est pas validée.`)
};

/**
* | output |
* | --- |
* | "No number yet: it is assigned on validation, in chronological order. The client receives nothing until the invoice is validated." |
*
* @param {Document_Draft_TextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_draft_text = /** @type {((inputs?: Document_Draft_TextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Draft_TextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_draft_text(inputs)
	return en_document_draft_text(inputs)
});