/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Document_QuoteInputs */

const en_paste_prompt_document_quote = /** @type {(inputs: Paste_Prompt_Document_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`a quote`)
};

const fr_paste_prompt_document_quote = /** @type {(inputs: Paste_Prompt_Document_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`un devis`)
};

/**
* | output |
* | --- |
* | "a quote" |
*
* @param {Paste_Prompt_Document_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_document_quote = /** @type {((inputs?: Paste_Prompt_Document_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Document_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_document_quote(inputs)
	return en_paste_prompt_document_quote(inputs)
});