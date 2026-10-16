/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Load_FailedInputs */

const en_document_load_failed = /** @type {(inputs: Document_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice could not be loaded.`)
};

const fr_document_load_failed = /** @type {(inputs: Document_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu être chargée.`)
};

/**
* | output |
* | --- |
* | "The invoice could not be loaded." |
*
* @param {Document_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_load_failed = /** @type {((inputs?: Document_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_load_failed(inputs)
	return en_document_load_failed(inputs)
});