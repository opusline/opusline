/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Document_HintInputs */

const en_quote_document_hint = /** @type {(inputs: Quote_Document_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF or scan, up to 20 MB. It is filed under the client, with their other documents.`)
};

const fr_quote_document_hint = /** @type {(inputs: Quote_Document_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF ou scan, jusqu'à 20 Mo. Il est classé sous le client, avec ses autres documents.`)
};

/**
* | output |
* | --- |
* | "PDF or scan, up to 20 MB. It is filed under the client, with their other documents." |
*
* @param {Quote_Document_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_hint = /** @type {((inputs?: Quote_Document_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_hint(inputs)
	return en_quote_document_hint(inputs)
});