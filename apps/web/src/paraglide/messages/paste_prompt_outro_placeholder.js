/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Outro_PlaceholderInputs */

const en_paste_prompt_outro_placeholder = /** @type {(inputs: Paste_Prompt_Outro_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`[describe the assignment here]`)
};

const fr_paste_prompt_outro_placeholder = /** @type {(inputs: Paste_Prompt_Outro_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`[décrivez la mission ici]`)
};

/**
* | output |
* | --- |
* | "[describe the assignment here]" |
*
* @param {Paste_Prompt_Outro_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_outro_placeholder = /** @type {((inputs?: Paste_Prompt_Outro_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Outro_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_outro_placeholder(inputs)
	return en_paste_prompt_outro_placeholder(inputs)
});