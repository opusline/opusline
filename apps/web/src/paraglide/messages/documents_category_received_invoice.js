/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_Received_InvoiceInputs */

const en_documents_category_received_invoice = /** @type {(inputs: Documents_Category_Received_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Received invoice`)
};

const fr_documents_category_received_invoice = /** @type {(inputs: Documents_Category_Received_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture reçue`)
};

/**
* | output |
* | --- |
* | "Received invoice" |
*
* @param {Documents_Category_Received_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_received_invoice = /** @type {((inputs?: Documents_Category_Received_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_Received_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_received_invoice(inputs)
	return en_documents_category_received_invoice(inputs)
});