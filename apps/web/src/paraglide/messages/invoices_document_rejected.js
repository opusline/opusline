/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown>, reason: NonNullable<unknown> }} Invoices_Document_RejectedInputs */

const en_invoices_document_rejected = /** @type {(inputs: Invoices_Document_RejectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}: ${i?.reason}`)
};

const fr_invoices_document_rejected = /** @type {(inputs: Invoices_Document_RejectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} : ${i?.reason}`)
};

/**
* | output |
* | --- |
* | "{name}: {reason}" |
*
* @param {Invoices_Document_RejectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_document_rejected = /** @type {((inputs: Invoices_Document_RejectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Document_RejectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_document_rejected(inputs)
	return en_invoices_document_rejected(inputs)
});