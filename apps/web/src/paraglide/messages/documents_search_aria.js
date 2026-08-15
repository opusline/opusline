/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Search_AriaInputs */

const en_documents_search_aria = /** @type {(inputs: Documents_Search_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search documents`)
};

const fr_documents_search_aria = /** @type {(inputs: Documents_Search_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechercher un document`)
};

/**
* | output |
* | --- |
* | "Search documents" |
*
* @param {Documents_Search_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_search_aria = /** @type {((inputs?: Documents_Search_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Search_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_search_aria(inputs)
	return en_documents_search_aria(inputs)
});