/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_CorrectInputs */

const en_document_correct = /** @type {(inputs: Document_CorrectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Correct the invoice`)
};

const fr_document_correct = /** @type {(inputs: Document_CorrectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Corriger la facture`)
};

/**
* | output |
* | --- |
* | "Correct the invoice" |
*
* @param {Document_CorrectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_correct = /** @type {((inputs?: Document_CorrectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_CorrectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_correct(inputs)
	return en_document_correct(inputs)
});