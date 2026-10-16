/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Document_EmptyInputs */

const en_quote_document_empty = /** @type {(inputs: Quote_Document_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline did not produce this quote. File the PDF your tool issued, so it is here when the client's answer comes.`)
};

const fr_quote_document_empty = /** @type {(inputs: Quote_Document_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline n'a pas produit ce devis. Classez le PDF émis par votre outil, pour l'avoir sous la main quand la réponse du client arrive.`)
};

/**
* | output |
* | --- |
* | "Opusline did not produce this quote. File the PDF your tool issued, so it is here when the client's answer comes." |
*
* @param {Quote_Document_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_document_empty = /** @type {((inputs?: Quote_Document_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Document_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_document_empty(inputs)
	return en_quote_document_empty(inputs)
});