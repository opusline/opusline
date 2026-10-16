/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Document_Draft_HeadingInputs */

const en_quote_document_draft_heading = /** @type {(inputs: Quote_Document_Draft_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft quote`)
};

const fr_quote_document_draft_heading = /** @type {(inputs: Quote_Document_Draft_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devis en brouillon`)
};

/**
* | output |
* | --- |
* | "Draft quote" |
*
* @param {Quote_Document_Draft_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_draft_heading = /** @type {((inputs?: Quote_Document_Draft_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_Draft_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_draft_heading(inputs)
	return en_quote_document_draft_heading(inputs)
});