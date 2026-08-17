/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Stat_PackInputs */

const en_my_documents_stat_pack = /** @type {(inputs: My_Documents_Stat_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administrative pack`)
};

const fr_my_documents_stat_pack = /** @type {(inputs: My_Documents_Stat_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dossier administratif`)
};

/**
* | output |
* | --- |
* | "Administrative pack" |
*
* @param {My_Documents_Stat_PackInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_stat_pack = /** @type {((inputs?: My_Documents_Stat_PackInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Stat_PackInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_stat_pack(inputs)
	return en_my_documents_stat_pack(inputs)
});