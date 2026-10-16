/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Paper_Load_FailedInputs */

const en_document_paper_load_failed = /** @type {(inputs: Document_Paper_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The document could not be displayed.`)
};

const fr_document_paper_load_failed = /** @type {(inputs: Document_Paper_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le document n'a pas pu être affiché.`)
};

/**
* | output |
* | --- |
* | "The document could not be displayed." |
*
* @param {Document_Paper_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_paper_load_failed = /** @type {((inputs?: Document_Paper_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Paper_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_paper_load_failed(inputs)
	return en_document_paper_load_failed(inputs)
});