/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Search_AriaInputs */

const en_quotes_search_aria = /** @type {(inputs: Quotes_Search_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search quotes`)
};

const fr_quotes_search_aria = /** @type {(inputs: Quotes_Search_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechercher un devis`)
};

/**
* | output |
* | --- |
* | "Search quotes" |
*
* @param {Quotes_Search_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_search_aria = /** @type {((inputs?: Quotes_Search_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Search_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_search_aria(inputs)
	return en_quotes_search_aria(inputs)
});