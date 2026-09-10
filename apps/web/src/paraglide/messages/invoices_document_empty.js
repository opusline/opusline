/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Document_EmptyInputs */

const en_invoices_document_empty = /** @type {(inputs: Invoices_Document_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline does not produce the invoice. File the one your billing tool issued, so it is here when a client asks for it again.`)
};

const fr_invoices_document_empty = /** @type {(inputs: Invoices_Document_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline ne produit pas la facture. Classez celle que votre outil de facturation a émise, pour l'avoir sous la main quand un client la redemande.`)
};

/**
* | output |
* | --- |
* | "Opusline does not produce the invoice. File the one your billing tool issued, so it is here when a client asks for it again." |
*
* @param {Invoices_Document_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_document_empty = /** @type {((inputs?: Invoices_Document_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Document_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_document_empty(inputs)
	return en_invoices_document_empty(inputs)
});