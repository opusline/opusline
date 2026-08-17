/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Stat_FiledInputs */

const en_my_documents_stat_filed = /** @type {(inputs: My_Documents_Stat_FiledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pieces filed`)
};

const fr_my_documents_stat_filed = /** @type {(inputs: My_Documents_Stat_FiledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pièces déposées`)
};

/**
* | output |
* | --- |
* | "Pieces filed" |
*
* @param {My_Documents_Stat_FiledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_stat_filed = /** @type {((inputs?: My_Documents_Stat_FiledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Stat_FiledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_stat_filed(inputs)
	return en_my_documents_stat_filed(inputs)
});