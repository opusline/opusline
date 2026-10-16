/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_Draft_ResumeInputs */

const en_document_draft_resume = /** @type {(inputs: Document_Draft_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Resume the draft`)
};

const fr_document_draft_resume = /** @type {(inputs: Document_Draft_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprendre le brouillon`)
};

/**
* | output |
* | --- |
* | "Resume the draft" |
*
* @param {Document_Draft_ResumeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_draft_resume = /** @type {((inputs?: Document_Draft_ResumeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_Draft_ResumeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_draft_resume(inputs)
	return en_document_draft_resume(inputs)
});