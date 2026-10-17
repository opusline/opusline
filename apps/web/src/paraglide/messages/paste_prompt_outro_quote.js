/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Outro_QuoteInputs */

const en_paste_prompt_outro_quote = /** @type {(inputs: Paste_Prompt_Outro_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Here is what I want to quote:`)
};

const fr_paste_prompt_outro_quote = /** @type {(inputs: Paste_Prompt_Outro_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voici ce que je veux chiffrer :`)
};

/**
* | output |
* | --- |
* | "Here is what I want to quote:" |
*
* @param {Paste_Prompt_Outro_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_outro_quote = /** @type {((inputs?: Paste_Prompt_Outro_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Outro_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_outro_quote(inputs)
	return en_paste_prompt_outro_quote(inputs)
});