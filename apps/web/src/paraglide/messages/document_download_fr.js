/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Download_FrInputs */

const en_document_download_fr = /** @type {(inputs: Document_Download_FrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download in French`)
};

const fr_document_download_fr = /** @type {(inputs: Document_Download_FrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Télécharger en français`)
};

/**
* | output |
* | --- |
* | "Download in French" |
*
* @param {Document_Download_FrInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_download_fr = /** @type {((inputs?: Document_Download_FrInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Download_FrInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_download_fr(inputs)
	return en_document_download_fr(inputs)
});