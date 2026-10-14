/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_BackInputs */

const en_document_back = /** @type {(inputs: Document_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to invoices`)
};

const fr_document_back = /** @type {(inputs: Document_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour aux factures`)
};

/**
* | output |
* | --- |
* | "Back to invoices" |
*
* @param {Document_BackInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_back = /** @type {((inputs?: Document_BackInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_BackInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_back(inputs)
	return en_document_back(inputs)
});