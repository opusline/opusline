/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_No_MatchInputs */

const en_documents_no_match = /** @type {(inputs: Documents_No_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No document matches the search.`)
};

const fr_documents_no_match = /** @type {(inputs: Documents_No_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun document ne correspond à la recherche.`)
};

/**
* | output |
* | --- |
* | "No document matches the search." |
*
* @param {Documents_No_MatchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_no_match = /** @type {((inputs?: Documents_No_MatchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_No_MatchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_no_match(inputs)
	return en_documents_no_match(inputs)
});