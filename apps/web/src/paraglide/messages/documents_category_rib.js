/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_RibInputs */

const en_documents_category_rib = /** @type {(inputs: Documents_Category_RibInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RIB`)
};

const fr_documents_category_rib = /** @type {(inputs: Documents_Category_RibInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RIB`)
};

/**
* | output |
* | --- |
* | "RIB" |
*
* @param {Documents_Category_RibInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_rib = /** @type {((inputs?: Documents_Category_RibInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_RibInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_rib(inputs)
	return en_documents_category_rib(inputs)
});