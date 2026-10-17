/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Document_InvoiceInputs */

const en_paste_prompt_document_invoice = /** @type {(inputs: Paste_Prompt_Document_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`an invoice`)
};

const fr_paste_prompt_document_invoice = /** @type {(inputs: Paste_Prompt_Document_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`une facture`)
};

/**
* | output |
* | --- |
* | "an invoice" |
*
* @param {Paste_Prompt_Document_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_document_invoice = /** @type {((inputs?: Paste_Prompt_Document_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Document_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_document_invoice(inputs)
	return en_paste_prompt_document_invoice(inputs)
});