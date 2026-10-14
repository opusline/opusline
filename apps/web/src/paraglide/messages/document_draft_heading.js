/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Draft_HeadingInputs */

const en_document_draft_heading = /** @type {(inputs: Document_Draft_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft invoice`)
};

const fr_document_draft_heading = /** @type {(inputs: Document_Draft_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillon de facture`)
};

/**
* | output |
* | --- |
* | "Draft invoice" |
*
* @param {Document_Draft_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_draft_heading = /** @type {((inputs?: Document_Draft_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Draft_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_draft_heading(inputs)
	return en_document_draft_heading(inputs)
});