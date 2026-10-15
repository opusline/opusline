/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Document_TitleInputs */

const en_invoices_document_title = /** @type {(inputs: Invoices_Document_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The document`)
};

const fr_invoices_document_title = /** @type {(inputs: Invoices_Document_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le document`)
};

/**
* | output |
* | --- |
* | "The document" |
*
* @param {Invoices_Document_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_document_title = /** @type {((inputs?: Invoices_Document_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Document_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_document_title(inputs)
	return en_invoices_document_title(inputs)
});