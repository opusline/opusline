/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_DuplicateInputs */

const en_document_duplicate = /** @type {(inputs: Document_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicate`)
};

const fr_document_duplicate = /** @type {(inputs: Document_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dupliquer`)
};

/**
* | output |
* | --- |
* | "Duplicate" |
*
* @param {Document_DuplicateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_duplicate = /** @type {((inputs?: Document_DuplicateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_DuplicateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_duplicate(inputs)
	return en_document_duplicate(inputs)
});