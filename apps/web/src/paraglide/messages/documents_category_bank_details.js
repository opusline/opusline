/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_Bank_DetailsInputs */

const en_documents_category_bank_details = /** @type {(inputs: Documents_Category_Bank_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank details`)
};

const fr_documents_category_bank_details = /** @type {(inputs: Documents_Category_Bank_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RIB`)
};

/**
* | output |
* | --- |
* | "Bank details" |
*
* @param {Documents_Category_Bank_DetailsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_bank_details = /** @type {((inputs?: Documents_Category_Bank_DetailsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_Bank_DetailsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_bank_details(inputs)
	return en_documents_category_bank_details(inputs)
});