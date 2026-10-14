/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Document_HeadingInputs */

const en_document_heading = /** @type {(inputs: Document_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number}`)
};

const fr_document_heading = /** @type {(inputs: Document_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Facture ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Invoice {number}" |
*
* @param {Document_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_heading = /** @type {((inputs: Document_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_heading(inputs)
	return en_document_heading(inputs)
});