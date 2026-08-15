/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Documents_Download_AriaInputs */

const en_documents_download_aria = /** @type {(inputs: Documents_Download_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download ${i?.name}`)
};

const fr_documents_download_aria = /** @type {(inputs: Documents_Download_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Télécharger ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Download {name}" |
*
* @param {Documents_Download_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_download_aria = /** @type {((inputs: Documents_Download_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Download_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_download_aria(inputs)
	return en_documents_download_aria(inputs)
});