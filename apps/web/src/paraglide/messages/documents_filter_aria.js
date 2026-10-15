/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Filter_AriaInputs */

const en_documents_filter_aria = /** @type {(inputs: Documents_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter by document type`)
};

const fr_documents_filter_aria = /** @type {(inputs: Documents_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filtrer par type de document`)
};

/**
* | output |
* | --- |
* | "Filter by document type" |
*
* @param {Documents_Filter_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_filter_aria = /** @type {((inputs?: Documents_Filter_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Filter_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_filter_aria(inputs)
	return en_documents_filter_aria(inputs)
});