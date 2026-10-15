/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_Terms_Of_SaleInputs */

const en_documents_category_terms_of_sale = /** @type {(inputs: Documents_Category_Terms_Of_SaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terms of sale`)
};

const fr_documents_category_terms_of_sale = /** @type {(inputs: Documents_Category_Terms_Of_SaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CGV`)
};

/**
* | output |
* | --- |
* | "Terms of sale" |
*
* @param {Documents_Category_Terms_Of_SaleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_terms_of_sale = /** @type {((inputs?: Documents_Category_Terms_Of_SaleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_Terms_Of_SaleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_terms_of_sale(inputs)
	return en_documents_category_terms_of_sale(inputs)
});