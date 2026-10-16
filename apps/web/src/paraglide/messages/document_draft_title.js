/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Draft_TitleInputs */

const en_document_draft_title = /** @type {(inputs: Document_Draft_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft`)
};

const fr_document_draft_title = /** @type {(inputs: Document_Draft_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillon`)
};

/**
* | output |
* | --- |
* | "Draft" |
*
* @param {Document_Draft_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_draft_title = /** @type {((inputs?: Document_Draft_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Draft_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_draft_title(inputs)
	return en_document_draft_title(inputs)
});