/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Document_ReplaceInputs */

const en_invoices_document_replace = /** @type {(inputs: Invoices_Document_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace`)
};

const fr_invoices_document_replace = /** @type {(inputs: Invoices_Document_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplacer`)
};

/**
* | output |
* | --- |
* | "Replace" |
*
* @param {Invoices_Document_ReplaceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_document_replace = /** @type {((inputs?: Invoices_Document_ReplaceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Document_ReplaceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_document_replace(inputs)
	return en_invoices_document_replace(inputs)
});