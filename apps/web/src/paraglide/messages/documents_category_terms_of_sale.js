/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_Terms_Of_SaleInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("CGV")
	return /** @type {LocalizedString} */ ("Terms of sale")
});