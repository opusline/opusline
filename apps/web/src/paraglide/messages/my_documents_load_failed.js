/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Load_FailedInputs */

const en_my_documents_load_failed = /** @type {(inputs: My_Documents_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not load your documents.`)
};

const fr_my_documents_load_failed = /** @type {(inputs: My_Documents_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger vos documents.`)
};

/**
* | output |
* | --- |
* | "Could not load your documents." |
*
* @param {My_Documents_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_load_failed = /** @type {((inputs?: My_Documents_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_load_failed(inputs)
	return en_my_documents_load_failed(inputs)
});