/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Stat_MissingInputs */

const en_my_documents_stat_missing = /** @type {(inputs: My_Documents_Stat_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Still missing`)
};

const fr_my_documents_stat_missing = /** @type {(inputs: My_Documents_Stat_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encore manquantes`)
};

/**
* | output |
* | --- |
* | "Still missing" |
*
* @param {My_Documents_Stat_MissingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_stat_missing = /** @type {((inputs?: My_Documents_Stat_MissingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Stat_MissingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_stat_missing(inputs)
	return en_my_documents_stat_missing(inputs)
});