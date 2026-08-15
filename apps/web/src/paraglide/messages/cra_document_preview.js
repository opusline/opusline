/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Document_PreviewInputs */

const en_cra_document_preview = /** @type {(inputs: Cra_Document_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Document preview`)
};

const fr_cra_document_preview = /** @type {(inputs: Cra_Document_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu du document`)
};

/**
* | output |
* | --- |
* | "Document preview" |
*
* @param {Cra_Document_PreviewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_document_preview = /** @type {((inputs?: Cra_Document_PreviewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Document_PreviewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_document_preview(inputs)
	return en_cra_document_preview(inputs)
});