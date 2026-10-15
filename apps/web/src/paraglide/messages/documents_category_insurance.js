/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_InsuranceInputs */

const en_documents_category_insurance = /** @type {(inputs: Documents_Category_InsuranceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insurance`)
};

const fr_documents_category_insurance = /** @type {(inputs: Documents_Category_InsuranceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assurance`)
};

/**
* | output |
* | --- |
* | "Insurance" |
*
* @param {Documents_Category_InsuranceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_insurance = /** @type {((inputs?: Documents_Category_InsuranceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_InsuranceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_insurance(inputs)
	return en_documents_category_insurance(inputs)
});