/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Document_DropInputs */

const en_invoices_document_drop = /** @type {(inputs: Invoices_Document_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add the invoice`)
};

const fr_invoices_document_drop = /** @type {(inputs: Invoices_Document_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter la facture`)
};

/**
* | output |
* | --- |
* | "Add the invoice" |
*
* @param {Invoices_Document_DropInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_document_drop = /** @type {((inputs?: Invoices_Document_DropInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Document_DropInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_document_drop(inputs)
	return en_invoices_document_drop(inputs)
});