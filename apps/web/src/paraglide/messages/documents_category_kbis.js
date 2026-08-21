/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_KbisInputs */

const en_documents_category_kbis = /** @type {(inputs: Documents_Category_KbisInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kbis`)
};

const fr_documents_category_kbis = /** @type {(inputs: Documents_Category_KbisInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kbis`)
};

/**
* | output |
* | --- |
* | "Kbis" |
*
* @param {Documents_Category_KbisInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_kbis = /** @type {((inputs?: Documents_Category_KbisInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_KbisInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_kbis(inputs)
	return en_documents_category_kbis(inputs)
});