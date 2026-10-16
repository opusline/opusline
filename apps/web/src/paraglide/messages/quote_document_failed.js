/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Document_FailedInputs */

const en_quote_document_failed = /** @type {(inputs: Quote_Document_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The document could not be filed.`)
};

const fr_quote_document_failed = /** @type {(inputs: Quote_Document_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le document n'a pas pu être classé.`)
};

/**
* | output |
* | --- |
* | "The document could not be filed." |
*
* @param {Quote_Document_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_failed = /** @type {((inputs?: Quote_Document_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_failed(inputs)
	return en_quote_document_failed(inputs)
});