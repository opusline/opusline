/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Missing_TitleInputs */

const en_my_documents_missing_title = /** @type {(inputs: My_Documents_Missing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your pack is incomplete`)
};

const fr_my_documents_missing_title = /** @type {(inputs: My_Documents_Missing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre dossier est incomplet`)
};

/**
* | output |
* | --- |
* | "Your pack is incomplete" |
*
* @param {My_Documents_Missing_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_missing_title = /** @type {((inputs?: My_Documents_Missing_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Missing_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_missing_title(inputs)
	return en_my_documents_missing_title(inputs)
});