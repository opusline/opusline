/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_SubtitleInputs */

const en_my_documents_subtitle = /** @type {(inputs: My_Documents_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The pieces your clients ask for before signing. Keep them up to date here.`)
};

const fr_my_documents_subtitle = /** @type {(inputs: My_Documents_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les pièces que vos clients réclament avant de signer. Gardez-les à jour ici.`)
};

/**
* | output |
* | --- |
* | "The pieces your clients ask for before signing. Keep them up to date here." |
*
* @param {My_Documents_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_subtitle = /** @type {((inputs?: My_Documents_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_subtitle(inputs)
	return en_my_documents_subtitle(inputs)
});