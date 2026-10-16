/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_PreviewInputs */

const en_document_preview = /** @type {(inputs: Document_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Document preview · page 1 of 1`)
};

const fr_document_preview = /** @type {(inputs: Document_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu du document · page 1 sur 1`)
};

/**
* | output |
* | --- |
* | "Document preview · page 1 of 1" |
*
* @param {Document_PreviewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_preview = /** @type {((inputs?: Document_PreviewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_PreviewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_preview(inputs)
	return en_document_preview(inputs)
});