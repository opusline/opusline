/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_From_QuoteInputs */

const en_document_from_quote = /** @type {(inputs: Document_From_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issued under quote`)
};

const fr_document_from_quote = /** @type {(inputs: Document_From_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Établie depuis le devis`)
};

/**
* | output |
* | --- |
* | "Issued under quote" |
*
* @param {Document_From_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_from_quote = /** @type {((inputs?: Document_From_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_From_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_from_quote(inputs)
	return en_document_from_quote(inputs)
});