/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Document_Remove_FailedInputs */

const en_invoices_document_remove_failed = /** @type {(inputs: Invoices_Document_Remove_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The document could not be removed.`)
};

const fr_invoices_document_remove_failed = /** @type {(inputs: Invoices_Document_Remove_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le document n'a pas pu être retiré.`)
};

/**
* | output |
* | --- |
* | "The document could not be removed." |
*
* @param {Invoices_Document_Remove_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_document_remove_failed = /** @type {((inputs?: Invoices_Document_Remove_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Document_Remove_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_document_remove_failed(inputs)
	return en_invoices_document_remove_failed(inputs)
});