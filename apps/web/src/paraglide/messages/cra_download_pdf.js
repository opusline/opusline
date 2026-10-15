/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Download_PdfInputs */

const en_cra_download_pdf = /** @type {(inputs: Cra_Download_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download the PDF`)
};

const fr_cra_download_pdf = /** @type {(inputs: Cra_Download_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Télécharger le PDF`)
};

/**
* | output |
* | --- |
* | "Download the PDF" |
*
* @param {Cra_Download_PdfInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_download_pdf = /** @type {((inputs?: Cra_Download_PdfInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Download_PdfInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_download_pdf(inputs)
	return en_cra_download_pdf(inputs)
});