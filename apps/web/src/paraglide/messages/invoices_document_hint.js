/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Document_HintInputs */

const en_invoices_document_hint = /** @type {(inputs: Invoices_Document_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF or scan, up to 20 MB. It is filed under the client, with their other documents.`)
};

const fr_invoices_document_hint = /** @type {(inputs: Invoices_Document_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF ou scan, 20 Mo maximum. Elle est classée chez le client, avec ses autres documents.`)
};

/**
* | output |
* | --- |
* | "PDF or scan, up to 20 MB. It is filed under the client, with their other documents." |
*
* @param {Invoices_Document_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_document_hint = /** @type {((inputs?: Invoices_Document_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Document_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_document_hint(inputs)
	return en_invoices_document_hint(inputs)
});