/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Document_Load_FailedInputs */

const en_quote_document_load_failed = /** @type {(inputs: Quote_Document_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The quote could not be loaded.`)
};

const fr_quote_document_load_failed = /** @type {(inputs: Quote_Document_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le devis n'a pas pu être chargé.`)
};

/**
* | output |
* | --- |
* | "The quote could not be loaded." |
*
* @param {Quote_Document_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_load_failed = /** @type {((inputs?: Quote_Document_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_load_failed(inputs)
	return en_quote_document_load_failed(inputs)
});