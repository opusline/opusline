/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_QuoteInputs */

const en_documents_category_quote = /** @type {(inputs: Documents_Category_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote`)
};

const fr_documents_category_quote = /** @type {(inputs: Documents_Category_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devis`)
};

/**
* | output |
* | --- |
* | "Quote" |
*
* @param {Documents_Category_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_quote = /** @type {((inputs?: Documents_Category_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_quote(inputs)
	return en_documents_category_quote(inputs)
});