/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_Issued_InvoiceInputs */

const en_documents_category_issued_invoice = /** @type {(inputs: Documents_Category_Issued_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice issued`)
};

const fr_documents_category_issued_invoice = /** @type {(inputs: Documents_Category_Issued_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture émise`)
};

/**
* | output |
* | --- |
* | "Invoice issued" |
*
* @param {Documents_Category_Issued_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_issued_invoice = /** @type {((inputs?: Documents_Category_Issued_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_Issued_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_issued_invoice(inputs)
	return en_documents_category_issued_invoice(inputs)
});