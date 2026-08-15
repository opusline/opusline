/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Uploading_TitleInputs */

const en_documents_uploading_title = /** @type {(inputs: Documents_Uploading_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uploads in progress`)
};

const fr_documents_uploading_title = /** @type {(inputs: Documents_Uploading_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envois en cours`)
};

/**
* | output |
* | --- |
* | "Uploads in progress" |
*
* @param {Documents_Uploading_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_uploading_title = /** @type {((inputs?: Documents_Uploading_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Uploading_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_uploading_title(inputs)
	return en_documents_uploading_title(inputs)
});