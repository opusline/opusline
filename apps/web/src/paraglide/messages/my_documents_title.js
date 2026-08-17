/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_TitleInputs */

const en_my_documents_title = /** @type {(inputs: My_Documents_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My documents`)
};

const fr_my_documents_title = /** @type {(inputs: My_Documents_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mes documents`)
};

/**
* | output |
* | --- |
* | "My documents" |
*
* @param {My_Documents_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_title = /** @type {((inputs?: My_Documents_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_title(inputs)
	return en_my_documents_title(inputs)
});