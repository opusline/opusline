/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Stat_Pack_SubInputs */

const en_my_documents_stat_pack_sub = /** @type {(inputs: My_Documents_Stat_Pack_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kbis, URSSAF, insurance, RIB`)
};

const fr_my_documents_stat_pack_sub = /** @type {(inputs: My_Documents_Stat_Pack_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kbis, URSSAF, assurance, RIB`)
};

/**
* | output |
* | --- |
* | "Kbis, URSSAF, insurance, RIB" |
*
* @param {My_Documents_Stat_Pack_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_stat_pack_sub = /** @type {((inputs?: My_Documents_Stat_Pack_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Stat_Pack_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_stat_pack_sub(inputs)
	return en_my_documents_stat_pack_sub(inputs)
});