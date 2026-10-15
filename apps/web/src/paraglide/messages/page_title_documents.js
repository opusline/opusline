/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_DocumentsInputs */

const en_page_title_documents = /** @type {(inputs: Page_Title_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents`)
};

const fr_page_title_documents = /** @type {(inputs: Page_Title_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents`)
};

/**
* | output |
* | --- |
* | "Documents" |
*
* @param {Page_Title_DocumentsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_documents = /** @type {((inputs?: Page_Title_DocumentsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_DocumentsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_documents(inputs)
	return en_page_title_documents(inputs)
});