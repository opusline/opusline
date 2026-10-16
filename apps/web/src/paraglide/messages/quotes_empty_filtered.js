/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Empty_FilteredInputs */

const en_quotes_empty_filtered = /** @type {(inputs: Quotes_Empty_FilteredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change the filter or the search, or write a quote.`)
};

const fr_quotes_empty_filtered = /** @type {(inputs: Quotes_Empty_FilteredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changez de filtre ou de recherche, ou créez un devis.`)
};

/**
* | output |
* | --- |
* | "Change the filter or the search, or write a quote." |
*
* @param {Quotes_Empty_FilteredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_empty_filtered = /** @type {((inputs?: Quotes_Empty_FilteredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Empty_FilteredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_empty_filtered(inputs)
	return en_quotes_empty_filtered(inputs)
});