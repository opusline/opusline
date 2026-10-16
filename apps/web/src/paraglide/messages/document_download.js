/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_DownloadInputs */

const en_document_download = /** @type {(inputs: Document_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download`)
};

const fr_document_download = /** @type {(inputs: Document_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Télécharger`)
};

/**
* | output |
* | --- |
* | "Download" |
*
* @param {Document_DownloadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_download = /** @type {((inputs?: Document_DownloadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_DownloadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_download(inputs)
	return en_document_download(inputs)
});