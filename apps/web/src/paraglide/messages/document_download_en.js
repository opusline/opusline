/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Download_EnInputs */

const en_document_download_en = /** @type {(inputs: Document_Download_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download in English`)
};

const fr_document_download_en = /** @type {(inputs: Document_Download_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Télécharger en anglais`)
};

/**
* | output |
* | --- |
* | "Download in English" |
*
* @param {Document_Download_EnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_download_en = /** @type {((inputs?: Document_Download_EnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Download_EnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_download_en(inputs)
	return en_document_download_en(inputs)
});