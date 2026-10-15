/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Search_PlaceholderInputs */

const en_documents_search_placeholder = /** @type {(inputs: Documents_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search`)
};

const fr_documents_search_placeholder = /** @type {(inputs: Documents_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechercher`)
};

/**
* | output |
* | --- |
* | "Search" |
*
* @param {Documents_Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_search_placeholder = /** @type {((inputs?: Documents_Search_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Search_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_search_placeholder(inputs)
	return en_documents_search_placeholder(inputs)
});