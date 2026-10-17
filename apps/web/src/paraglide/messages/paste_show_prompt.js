/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Show_PromptInputs */

const en_paste_show_prompt = /** @type {(inputs: Paste_Show_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show the prompt`)
};

const fr_paste_show_prompt = /** @type {(inputs: Paste_Show_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voir le prompt`)
};

/**
* | output |
* | --- |
* | "Show the prompt" |
*
* @param {Paste_Show_PromptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_show_prompt = /** @type {((inputs?: Paste_Show_PromptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Show_PromptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_show_prompt(inputs)
	return en_paste_show_prompt(inputs)
});