/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_ContractInputs */

const en_documents_category_contract = /** @type {(inputs: Documents_Category_ContractInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contract`)
};

const fr_documents_category_contract = /** @type {(inputs: Documents_Category_ContractInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contrat`)
};

/**
* | output |
* | --- |
* | "Contract" |
*
* @param {Documents_Category_ContractInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_contract = /** @type {((inputs?: Documents_Category_ContractInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_ContractInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_contract(inputs)
	return en_documents_category_contract(inputs)
});