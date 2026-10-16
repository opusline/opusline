/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Document_BackInputs */

const en_quote_document_back = /** @type {(inputs: Quote_Document_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to quotes`)
};

const fr_quote_document_back = /** @type {(inputs: Quote_Document_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour aux devis`)
};

/**
* | output |
* | --- |
* | "Back to quotes" |
*
* @param {Quote_Document_BackInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_back = /** @type {((inputs?: Quote_Document_BackInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_BackInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_back(inputs)
	return en_quote_document_back(inputs)
});