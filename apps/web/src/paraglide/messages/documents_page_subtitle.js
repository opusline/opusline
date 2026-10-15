/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Page_SubtitleInputs */

const en_documents_page_subtitle = /** @type {(inputs: Documents_Page_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The pieces your clients ask for before signing. Keep them up to date here.`)
};

const fr_documents_page_subtitle = /** @type {(inputs: Documents_Page_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les pièces que vos clients réclament avant de signer. Gardez-les à jour ici.`)
};

/**
* | output |
* | --- |
* | "The pieces your clients ask for before signing. Keep them up to date here." |
*
* @param {Documents_Page_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_page_subtitle = /** @type {((inputs?: Documents_Page_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Page_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_page_subtitle(inputs)
	return en_documents_page_subtitle(inputs)
});