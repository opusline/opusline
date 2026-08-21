/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Page_TitleInputs */

const en_documents_page_title = /** @type {(inputs: Documents_Page_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My documents`)
};

const fr_documents_page_title = /** @type {(inputs: Documents_Page_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mes documents`)
};

/**
* | output |
* | --- |
* | "My documents" |
*
* @param {Documents_Page_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_page_title = /** @type {((inputs?: Documents_Page_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Page_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_page_title(inputs)
	return en_documents_page_title(inputs)
});