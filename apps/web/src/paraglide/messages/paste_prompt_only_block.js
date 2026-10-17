/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Only_BlockInputs */

const en_paste_prompt_only_block = /** @type {(inputs: Paste_Prompt_Only_BlockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Answer ONLY with this block, with no text before or after and no Markdown:`)
};

const fr_paste_prompt_only_block = /** @type {(inputs: Paste_Prompt_Only_BlockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réponds UNIQUEMENT avec ce bloc, sans texte avant ni après, sans Markdown :`)
};

/**
* | output |
* | --- |
* | "Answer ONLY with this block, with no text before or after and no Markdown:" |
*
* @param {Paste_Prompt_Only_BlockInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_only_block = /** @type {((inputs?: Paste_Prompt_Only_BlockInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Only_BlockInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_only_block(inputs)
	return en_paste_prompt_only_block(inputs)
});