/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Document_LanguageInputs */

const en_invoicing_document_language = /** @type {(inputs: Invoicing_Document_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default document language`)
};

const fr_invoicing_document_language = /** @type {(inputs: Invoicing_Document_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue par défaut des documents`)
};

/**
* | output |
* | --- |
* | "Default document language" |
*
* @param {Invoicing_Document_LanguageInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_document_language = /** @type {((inputs?: Invoicing_Document_LanguageInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Document_LanguageInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_document_language(inputs)
	return en_invoicing_document_language(inputs)
});