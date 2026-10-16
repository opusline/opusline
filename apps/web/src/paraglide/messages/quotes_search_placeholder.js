/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Search_PlaceholderInputs */

const en_quotes_search_placeholder = /** @type {(inputs: Quotes_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search by number, title or client`)
};

const fr_quotes_search_placeholder = /** @type {(inputs: Quotes_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechercher par numéro, titre ou client`)
};

/**
* | output |
* | --- |
* | "Search by number, title or client" |
*
* @param {Quotes_Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_search_placeholder = /** @type {((inputs?: Quotes_Search_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Search_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_search_placeholder(inputs)
	return en_quotes_search_placeholder(inputs)
});