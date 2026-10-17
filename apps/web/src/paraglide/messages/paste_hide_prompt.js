/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Hide_PromptInputs */

const en_paste_hide_prompt = /** @type {(inputs: Paste_Hide_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hide the prompt`)
};

const fr_paste_hide_prompt = /** @type {(inputs: Paste_Hide_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Masquer le prompt`)
};

/**
* | output |
* | --- |
* | "Hide the prompt" |
*
* @param {Paste_Hide_PromptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_hide_prompt = /** @type {((inputs?: Paste_Hide_PromptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Hide_PromptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_hide_prompt(inputs)
	return en_paste_hide_prompt(inputs)
});