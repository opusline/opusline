/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Document_DropInputs */

const en_quote_document_drop = /** @type {(inputs: Quote_Document_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add the quote`)
};

const fr_quote_document_drop = /** @type {(inputs: Quote_Document_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter le devis`)
};

/**
* | output |
* | --- |
* | "Add the quote" |
*
* @param {Quote_Document_DropInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_drop = /** @type {((inputs?: Quote_Document_DropInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_DropInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_drop(inputs)
	return en_quote_document_drop(inputs)
});