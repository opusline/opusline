/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Quote_Document_HeadingInputs */

const en_quote_document_heading = /** @type {(inputs: Quote_Document_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote ${i?.number}`)
};

const fr_quote_document_heading = /** @type {(inputs: Quote_Document_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Devis ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Quote {number}" |
*
* @param {Quote_Document_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_heading = /** @type {((inputs: Quote_Document_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_heading(inputs)
	return en_quote_document_heading(inputs)
});