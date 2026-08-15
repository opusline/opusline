/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_Signed_CraInputs */

const en_documents_category_signed_cra = /** @type {(inputs: Documents_Category_Signed_CraInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed CRA`)
};

const fr_documents_category_signed_cra = /** @type {(inputs: Documents_Category_Signed_CraInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CRA signé`)
};

/**
* | output |
* | --- |
* | "Signed CRA" |
*
* @param {Documents_Category_Signed_CraInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_signed_cra = /** @type {((inputs?: Documents_Category_Signed_CraInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_Signed_CraInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_signed_cra(inputs)
	return en_documents_category_signed_cra(inputs)
});