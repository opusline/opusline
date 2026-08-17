/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Complete_TitleInputs */

const en_my_documents_complete_title = /** @type {(inputs: My_Documents_Complete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your pack is complete`)
};

const fr_my_documents_complete_title = /** @type {(inputs: My_Documents_Complete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre dossier est complet`)
};

/**
* | output |
* | --- |
* | "Your pack is complete" |
*
* @param {My_Documents_Complete_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_complete_title = /** @type {((inputs?: My_Documents_Complete_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Complete_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_complete_title(inputs)
	return en_my_documents_complete_title(inputs)
});